/**
 * Virtual filesystem manifest.
 * Maps the directory tree to external content files and downloadable assets.
 *
 * Supported node types:
 * - "directory": requires `name` and `children` (array of nodes).
 * - "file": requires `name` and `src` (path to an external text file in /content).
 * - "download": requires `name`, `url` (path in /assets), and `filename`.
 */
export const FILE_SYSTEM = {
  name: "~",
  type: "directory",
  children: [
    {
      name: "about.txt",
      type: "file",
      src: "content/about.txt"
    },
    {
      name: "projects/",
      type: "directory",
      children: [
        {
          name: "personal_site.txt",
          type: "file",
          src: "content/projects/personal_site.txt"
        }
      ]
    },
    {
      name: "contact.txt",
      type: "file",
      src: "content/contact.txt"
    },
    {
      name: "licence.txt",
      type: "file",
      src: "content/licence.txt"
    }
  ]
};
