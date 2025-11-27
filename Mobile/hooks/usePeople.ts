import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiService } from "../services/api";
import { Person, LikeDislikeResponse } from "../types";

export const usePeople = () => {
  return useInfiniteQuery({
    queryKey: ["people"],
    queryFn: ({ pageParam = 1 }) => apiService.getPeople(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Liked people list (uses /people/liked)
export const useLikedPeople = () => {
  return useInfiniteQuery({
    queryKey: ["liked-people"],
    queryFn: ({ pageParam = 1 }) => apiService.getLikedPeople(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useLikePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personId: string) => apiService.likePerson(personId),
    onSuccess: (data: LikeDislikeResponse) => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["liked-people"] });
    },
  });
};

export const useDislikePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personId: string) => apiService.dislikePerson(personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["liked-people"] });
    },
  });
};
