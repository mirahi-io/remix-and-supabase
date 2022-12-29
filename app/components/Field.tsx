import { useController } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  disabled: boolean;
};

/**
 * Generic field for react-hook-form.
 */
export default function Field({
  name,
  type,
  label,
  disabled,
  placeholder,
}: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return (
    <fieldset disabled={disabled} className="flex flex-col">
      <label htmlFor={name}>{label}: </label>
      <input
        type={type}
        placeholder={placeholder}
        id={name}
        className="py-1 px-2 min-w-[300px] text-black rounded"
        {...field}
      />
      {error && <span className="text-red-500">{error.message}</span>}
    </fieldset>
  );
}
