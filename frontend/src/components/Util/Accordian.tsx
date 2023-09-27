import Image from "next/image";

interface IAccordian {
  question: string;
  answer: string[];
  image?: string;
  sectionId: string;
  toggleSection: (sectionId: string) => void;
  activeSection: string | null;
  finalQ: boolean;
  firstQ: boolean;
}

export default function Accordian({
  question,
  answer,
  image,
  sectionId,
  toggleSection,
  activeSection,
  finalQ,
  firstQ,
}: IAccordian) {
  return (
    <>
      <h2>
        <button
          type="button"
          className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border ${!finalQ ? 'border-b-0' : ''} border-gray-200 ${firstQ ? 'rounded-t-xl' : ''} focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}
          onClick={() => toggleSection(sectionId)}
          aria-expanded={activeSection === sectionId}
          aria-controls={`${sectionId}-content`}
        >
          <span>{question}</span>
          <svg
            data-accordion-icon
            className="w-3 h-3 rotate-180 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`${sectionId}-content`}
        className={activeSection === sectionId ? "" : "hidden"}
      >
        <div className={`p-5 border ${!finalQ ? 'border-b-0' : ''} border-gray-200 dark:border-gray-700 dark:bg-gray-900`}>
          {answer.map((line, index) => (
            <p key={index} className="mb-2 text-gray-500 dark:text-gray-400">
              {line}
            </p>
          ))}
          {image && (
            <div className="mt-4">
              <Image
                src={image}
                alt={question}
                width={500} // Adjust based on your needs
                height={300} // Adjust based on your needs
                layout="responsive"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
