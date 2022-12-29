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
    <li className="flex flex-col my-2 p-2 min-w-[300px] border-2 border-slate-300 bg-slate-700 rounded">
      <h3 className="text-2xl font-bold">{name}</h3>
      <p>
        Developer: <span className="text-red-500">{developer}</span>
      </p>
      <p>
        Publisher: <span className="text-red-500">{publisher}</span>
      </p>
      <div className="flex justify-around mt-4">
        <Link
          to={id.toString()}
          className="bg-slate-100 px-2 py-1 min-w-[100px] text-center text-black hover:bg-slate-400 focus:bg-slate-400 rounded"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(id)}
          className="bg-red-500 px-2 py-1 min-w-[100px] text-center hover:bg-red-600 focus:bg-red-600 rounded"
        >
          Delete
        </button>
      </div>
      {deletionError && <p>{deletionError}</p>}
    </li>
  );
}
