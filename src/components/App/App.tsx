import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovie } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const queryData = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovie(query, page),
    enabled: query !== "",
    placeholderData: (previousData) => previousData,
  });

  const totalPages = queryData.data?.total_pages || 0;
  useEffect(() => {
    if (queryData.data?.results.length === 0 && query !== "") {
      toast.error("No movies found for your request.");
    }
    return;
  }, [queryData.data, query]);

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  return (
    <div>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      {queryData.isLoading && <Loader />}
      {queryData.isError && <ErrorMessage />}
      {queryData.data && (
        <MovieGrid
          onSelect={setSelectedMovie}
          movies={queryData.data.results}
        />
      )}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </div>
  );
}

export default App;
