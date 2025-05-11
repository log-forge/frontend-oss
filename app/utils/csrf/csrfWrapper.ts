import type { ActionFunction, LoaderFunction } from "react-router";
import { csrf } from "../cookies/csrf.server";

/**
 * Wraps a loader or action function with CSRF validation.
 *
 * This higher-order function takes a function (which can be either a loader or an action)
 * and returns a new function that first validates the CSRF token for mutating HTTP methods
 * (i.e., POST, PUT, DELETE, PATCH) before executing the original function.
 *
 * The CSRF validation is performed by:
 * - Cloning the original request to avoid consuming its body.
 * - Converting the request payload into URLSearchParams format, handling both JSON and form-data.
 * - Constructing a new request with "application/x-www-form-urlencoded" as the Content-Type.
 * - Invoking the CSRF library's validation on the new request.
 *
 * If the CSRF validation fails, the function returns a 403 response with a JSON error message.
 *
 * @template T - A function type that extends either LoaderFunction or ActionFunction.
 * @param fn - The original function to be wrapped with CSRF validation.
 * @returns A new function that validates the CSRF token before delegating to the original function.
 *
 * @example
 * // Example usage with an action:
 * import type { ActionFunction } from "react-router";
 *
 * const myAction: ActionFunction = async ({ request }) => {
 *   // Your action logic
 *   return new Response("Action executed successfully.");
 * };
 *
 * export const action = withCsrfValidation(myAction);
 *
 * // Example usage with a loader:
 * import type { LoaderFunction } from "react-router";
 *
 * const myLoader: LoaderFunction = async ({ request }) => {
 *   // Your loader logic
 *   return new Response("Loader executed successfully.");
 * };
 *
 * export const loader = withCsrfValidation(myLoader);
 */
export function withCsrfValidation<T extends LoaderFunction | ActionFunction>(fn: T): T {
	return (async (args) => {
		const { request } = args;
		const mutatingMethods = ["POST", "PUT", "DELETE", "PATCH"];

		if (mutatingMethods.includes(request.method.toUpperCase())) {
			try {
				// Clone the request to avoid consuming the original body.
				const clonedRequest = request.clone();
				let params = new URLSearchParams();
				const contentType = request.headers.get("Content-Type");

				if (contentType?.includes("application/json")) {
					// If JSON, convert the data into URLSearchParams format.
					const jsonData = await clonedRequest.json();
					Object.entries(jsonData).forEach(([key, value]) => {
						params.append(key, String(value));
					});
				} else {
					// Otherwise, assume it's form-data.
					const formData = await clonedRequest.formData();
					for (const [key, value] of formData.entries()) {
						params.append(key, value.toString());
					}
				}

				// Build a new request for CSRF validation.
				const csrfRequest = new Request(request.url, {
					method: request.method,
					headers: {
						...Object.fromEntries(request.headers.entries()),
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: params,
				});

				// Validate the CSRF token using your CSRF library.
				await csrf.validate(csrfRequest);
			} catch (error: any) {
				console.error("CSRF validation error:", error);
				// If validation fails, return a 403 response with JSON error message.
				return new Response(JSON.stringify({ error: { message: error.message || "CSRF validation failed" } }), {
					status: 403,
					headers: { "Content-Type": "application/json" },
				});
			}
		}

		// Proceed to the original loader or action if validation passes.
		return await fn(args);
	}) as T;
}
