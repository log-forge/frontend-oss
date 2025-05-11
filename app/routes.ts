import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("colors", "routes/colors.tsx"),
  ...prefix("containers/:id", [
    index("./routes/containers/containers.$id.tsx"),
    layout("./routes/containers/layout/containers-layout.tsx", [
      route("logs", "./routes/containers/containers.$id.logs.tsx"),
      route("alerts", "./routes/containers/containers.$id.alerts.tsx"),
    ]),
  ]),
  ...prefix("resources", [route("theme-switch", "routes/resources/theme-switch.ts")]),
] satisfies RouteConfig;
