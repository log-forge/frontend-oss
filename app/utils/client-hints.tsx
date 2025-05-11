import { getHintUtils } from "@epic-web/client-hints";
import { useRevalidator } from "react-router";
import { clientHint as colorSchemeHint, subscribeToSchemeChange } from "@epic-web/client-hints/color-scheme";
import { useEffect } from "react";

const hintsUtils = getHintUtils({
	theme: colorSchemeHint,
});

// Create a component to detect and update client hints
export function ClientHintCheck() {
	const { revalidate } = useRevalidator();

	useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate]);

	return (
		<script
			dangerouslySetInnerHTML={{
				__html: hintsUtils.getClientHintCheckScript(),
			}}
		/>
	);
}

// Export getHints for use in loaders
export const { getHints } = hintsUtils;
