import { useInfiniteQuery } from "react-query";
import { fetchData } from "./services/api";
import { useCallback, useMemo, useRef } from "react";

function App() {
  const observer = useRef<IntersectionObserver>();

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: ({ pageParam }) => fetchData(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
  const flatData = useMemo(() => data?.pages.flat() ?? [], [data]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        console.log(entries);
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );
  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error on fetch data...</h1>;

  return (
    <div>
      {flatData?.map((item) => (
        <div key={item.id} ref={lastElementRef}>
          <p>{item.title}</p>
        </div>
      ))}

      {isFetching && <div>Fetching more data...</div>}
    </div>
  );
}

export default App;
