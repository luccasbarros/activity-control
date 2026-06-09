type ServerLogInput = {
  event: string;
  actorId?: string;
  actorEmail?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export function logServerEvent(input: ServerLogInput) {
  console.info(
    JSON.stringify({
      level: "info",
      service: "activity-control",
      timestamp: new Date().toISOString(),
      ...input,
    }),
  );
}
