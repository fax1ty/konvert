import { ChevronRight } from "lucide-react";

export function Congratulations() {
  return (
    <a
      href="#"
      className="mb-7 inline-flex items-center justify-between rounded-full bg-gray-800 px-1 py-1 pr-4 text-sm duration-300 hover:bg-gray-700"
      role="alert"
    >
      <span className="bg-primary-600 mr-3 rounded-full px-4 py-1.5 text-xs">
        New
      </span>{" "}
      <span className="text-sm font-medium">
        {`Flowbite is out! See what's new`}
      </span>
      <ChevronRight className="ml-2 size-5" />
    </a>
  );
}
