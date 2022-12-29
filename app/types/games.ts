export type Game = {
  id: number;
  name: string;
  publisher: string;
  developer: string;
};

export type GameForm = Omit<Game, "id">;
