import { apiGet, type ApiResponse } from "./api";

// UI-facing types kept for compatibility with current components
export interface Player {
  nombre: string;
  edad: number;
  nacionalidad: string;
  rol: string;
  instagram: string;
  imagen: string;
}

export interface Team {
  id: string; // slug used in routes (generated from name)
  nombre: string;
  emoji: string;
  bgClass: string;
  descripcion: string;
  imagen: string;
  players: Player[];
}

// Backend API types
export interface ApiTeam {
  teamId: string;
  name: string;
  slug: string | null;
  emoji: string | null;
  bannerUrl: string | null;
  description: string | null;
  achievements: Record<string, string> | null;
}

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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapApiPlayerToUi(p: ApiPlayer): Player {
  return {
    nombre: p.name,
    edad: p.age ?? 0,
    nacionalidad: p.country ?? "🇦🇷 Argentina",
    rol: p.role ?? "Jugador",
    instagram: p.instagram ?? "",
    imagen: p.photoUrl || "/players/default.jpg",
  };
}

function mapApiTeamToUi(t: ApiTeam, players: ApiPlayer[] = []): Team {
  const slug = t.slug || slugify(t.name);
  return {
    id: slug,
    nombre: t.name,
    emoji: t.emoji || "🎮",
    bgClass: "bg-primary-subtle",
    descripcion: t.description || "",
    imagen: t.bannerUrl || "/pucarahero.png",
    players: players.map(mapApiPlayerToUi),
  };
}

/**
 * Fetch all teams from backend.
 * Note: index endpoint returns wrapped payload { success, message, data }
 */
async function fetchAllTeams(): Promise<ApiTeam[]> {
  const res = await apiGet<ApiResponse<ApiTeam[]>>("/api/v1/teams");
  return res?.data || [];
}

/**
 * Fetch a single team with its players from backend.
 */
async function fetchTeamWithPlayers(
  teamId: string
): Promise<{ team: ApiTeam | null; players: ApiPlayer[] }> {
  const res = await apiGet<ApiResponse<ApiTeam & { players: ApiPlayer[] }>>(
    `/api/v1/teams/${teamId}`
  );
  const data = res?.data;
  if (!data) return { team: null, players: [] };
  const { players, ...team } = data as unknown as ApiTeam & {
    players: ApiPlayer[];
  };
  return { team, players: players || [] };
}

// Public helpers used by pages
export const getAllTeams = async (): Promise<Team[]> => {
  const apiTeams = await fetchAllTeams();
  // The index endpoint does not include players; we provide empty lists here
  return apiTeams.map((t) => mapApiTeamToUi(t, []));
};

export const getTeamById = async (
  slugOrId: string
): Promise<Team | undefined> => {
  // Accept either slug (preferred) or a raw teamId (UUID)
  const apiTeams = await fetchAllTeams();
  let selected: ApiTeam | undefined;

  // First try match by stored slug
  selected = apiTeams.find((t) => t.slug === slugOrId);

  // Then try generated slug from name
  if (!selected) {
    selected = apiTeams.find((t) => slugify(t.name) === slugOrId);
  }

  // If none, try raw teamId
  if (!selected) {
    selected = apiTeams.find((t) => t.teamId === slugOrId);
  }

  if (!selected) return undefined;

  const { team, players } = await fetchTeamWithPlayers(selected.teamId);
  if (!team) return undefined;
  return mapApiTeamToUi(team, players);
};

export const getTeamStaticPaths = async () => {
  const apiTeams = await fetchAllTeams();
  return apiTeams.map((t) => ({
    params: { team: t.slug || slugify(t.name) },
  }));
};
