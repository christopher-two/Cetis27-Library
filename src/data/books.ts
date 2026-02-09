export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  location: string;
}

export const books: Book[] = [
  {
    id: "1",
    title: "El Quijote",
    author: "Miguel de Cervantes",
    isbn: "978-3-16-148410-0",
    copies: 5,
    available: 3,
    location: "Estante A-1",
  },
  {
    id: "2",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    isbn: "978-0-06-088328-7",
    copies: 8,
    available: 5,
    location: "Estante B-2",
  },
  {
    id: "3",
    title: "Rayuela",
    author: "Julio Cortázar",
    isbn: "978-0-307-35047-7",
    copies: 4,
    available: 2,
    location: "Estante A-3",
  },
  {
    id: "4",
    title: "Donde habitan los ángeles",
    author: "Claudia Celis",
    isbn: "978-607-453-128-4",
    copies: 10,
    available: 10,
    location: "Estante C-1",
  },
  {
    id: "5",
    title: "Pedro Páramo",
    author: "Juan Rulfo",
    isbn: "978-0-8021-3390-8",
    copies: 6,
    available: 1,
    location: "Estante B-1",
  },
];
