import type { Components } from "react-markdown";

export const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-8 mb-4 sm:mt-12 sm:mb-6 text-title tracking-tight border-b pb-2 border-divider">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-7 mb-3 sm:mt-10 sm:mb-4 text-title tracking-tight">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mt-6 mb-2 sm:mt-8 sm:mb-3 text-title tracking-tight">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="text-body leading-7 md:leading-8 mb-4 sm:mb-5 text-[15px] md:text-[16px] tracking-normal break-keep">
      {children}
    </p>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary decoration-primary/30 underline underline-offset-4 hover:decoration-primary transition-colors font-medium"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),

  strong: ({ children }) => (
    <strong className="font-bold text-title px-0.5">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="italic text-body/90 bg-secondary/5 px-1 rounded">
      {children}
    </em>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary px-5 my-6 sm:my-8 text-secondary italic">
      {children}
    </blockquote>
  ),

  ul: ({ children }) => (
    <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 space-y-2 sm:space-y-2.5 text-body leading-7">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal pl-5 sm:pl-6 mb-5 sm:mb-6 space-y-2 sm:space-y-2.5 text-body leading-7">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="pl-0.5 sm:pl-1 text-[15px] md:text-[16px]">{children}</li>
  ),

  hr: () => (
    <hr className="my-10 sm:my-12 border-0 h-px bg-linear-to-r from-transparent via-divider to-transparent w-full" />
  ),

  code({ className, children }) {
    if (!className) {
      return (
        <code className="bg-secondary/10 text-primary-focus px-1.5 py-0.5 rounded-md text-[0.9em] font-mono font-medium">
          {children}
        </code>
      );
    }

    return (
      <div className="group relative my-6 sm:my-7">
        <pre className="bg-[#0d1117] p-4 sm:p-5 rounded-xl leading-6 text-[13px] sm:text-[14px] md:text-[15px] font-mono overflow-x-auto">
          <code className={`${className} block`}>{children}</code>
        </pre>
      </div>
    );
  },

  img: ({ src, alt }) => (
    <span className="block my-8 sm:my-10">
      <img
        src={src ?? ""}
        alt={alt ?? ""}
        className="rounded-xl shadow-md max-w-full mx-auto border border-divider w-full md:w-7/10"
        loading="lazy"
      />
      {alt && (
        <span className="block text-center text-xs md:text-sm text-secondary mt-2 sm:mt-3 opacity-70">
          {alt}
        </span>
      )}
    </span>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto my-6 sm:my-8 shadow-sm rounded-lg border border-divider">
      <table className="w-full border-collapse text-sm md:text-base text-left">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-secondary/5 border-b border-divider">{children}</thead>
  ),

  th: ({ children }) => (
    <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-title text-sm md:text-base">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-divider text-body align-top text-sm md:text-base">
      {children}
    </td>
  ),
};
