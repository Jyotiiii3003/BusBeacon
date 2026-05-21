export function fallbackLocation(stops = []) {
  const first = stops[0];
  return first ? [first.latitude, first.longitude] : [28.5585, 77.2066];
}

export function routePositions(stops = []) {
  return stops.map((stop) => [stop.latitude, stop.longitude]);
}
