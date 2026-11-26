/**
 * Virtual filesystem manifest.
 * Maps the directory tree to external content files and downloadable assets.
 *
 * Supported node types:
 * - "directory": requires `name` and `children` (array of nodes).
 * - "file": requires `name` and `src` (path to an external text file in /content).
 * - "download": requires `name`, `url` (path in /assets), and `filename`.
 * - "link": requires `name` and `href` (external HTTPS URL).
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
      name: "UNED/",
      type: "directory",
      children: [
        {
          name: "asignaturas.txt",
          type: "file",
          src: "content/UNED/asignaturas.txt"
        },
        {
          name: "MIBD/",
          type: "directory",
          children: [
            {
              name: "README.txt",
              type: "file",
              src: "content/UNED/MIBD/README.txt"
            },
            {
              name: "MIBD_anki_T1_v1.apkg",
              type: "download",
              url: "assets/MIBD_anki_T1_v1.apkg",
              filename: "MIBD_anki_T1_v1.apkg"
            },
            {
              name: "MIBD_anki_T2_v1.apkg",
              type: "download",
              url: "assets/MIBD_anki_T2_v1.apkg",
              filename: "MIBD_anki_T2_v1.apkg"
            },
            {
              name: "MIBD_Copilot.url",
              type: "link",
              href: "https://notebook.google.com/notebook/190ae618-8e48-49c6-bb9f-86cef8f56b75"
            }
          ]
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
