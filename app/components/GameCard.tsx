import { Link } from "@remix-run/react";
import type { Game } from "~/types/games";

type Props = Game & {
  handleDelete: (id: number) => void;
  deletionError?: string;
};

/**
 * A single video game card component
 */
export default function GameCard({
  id,
  name,
  developer,
  publisher,
  handleDelete,
  deletionError,
}: Props) {
  return (
    <li className="flex flex-col my-2 p-2 border-2 border-slate-300 rounded">
      <h3 className="text-2xl font-bold">{name}</h3>
      <p>Developer: {developer}</p>
      <p>Publisher: {publisher}</p>
      <div className="flex justify-around mt-2">
        <Link
          to={id.toString()}
          className="bg-red-500 px-2 py-1 hover:bg-red-600 focus:bg-red-600 rounded"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(id)}
          className="bg-red-500 px-2 py-1 hover:bg-red-600 focus:bg-red-600 rounded"
        >
          Delete
        </button>
      </div>
      {deletionError && <p>{deletionError}</p>}
    </li>
  );
}
