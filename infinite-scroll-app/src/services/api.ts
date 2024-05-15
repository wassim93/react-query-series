export const fetchData = async (page: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_pages=${page}&_limit=${10}`
  );
  const todos = await response.json();
  return todos;
};
