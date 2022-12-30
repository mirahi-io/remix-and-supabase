import type { Game } from "./games";

export interface Database {
  public: {
    Tables: {
      video_games: {
        Row: Game;
        Insert: Omit<Game, "id">;
        Update: Omit<Game, "id">;
      };
    };
    Views: {};
    Functions: {};
  };
}
