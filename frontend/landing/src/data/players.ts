import { apiGet } from "./api";

export interface ApiPlayer {
  playerId: string;
  name: string;
  age: number | null;
  role: string | null;
  country: string | null;
  instagram: string | null;
  bio: string | null;
  stats: Record<string, string> | null;
  photoUrl: string | null;
  teamId: string | null;
}

export async function getAllPlayers(): Promise<ApiPlayer[]> {
  return await apiGet<ApiPlayer[]>("/api/v1/players");
}

export async function getPlayersByTeam(teamId: string): Promise<ApiPlayer[]> {
  const all = await getAllPlayers();
  return all.filter((p) => p.teamId === teamId);
}

export async function getPlayerById(
  playerId: string
): Promise<ApiPlayer | undefined> {
  const url = `/api/v1/players/${playerId}`;
  try {
    return await apiGet<ApiPlayer>(url);
  } catch {
    return undefined;
  }
}
