// Redirected to /api/inquiry — old checkout API removed
export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    { error: "This endpoint is deprecated. Please use /api/inquiry instead." },
    { status: 410 }
  );
}
