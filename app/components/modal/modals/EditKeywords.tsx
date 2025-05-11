import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoAddOutline, IoCloseCircleOutline } from "react-icons/io5";
import DefaultButton from "~/components/components library/button/DefaultButton";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import type { ModalProps } from "~/context/ModalContext";
import { invalidateKeywords, setKeywords, removeKeywords } from "~/utils/tanstack/queries/keywordQueries";
import { useQueryStatus } from "~/utils/tanstack/states/queryStates";

export default function EditKeywords({ modalState, modalKey, closeModal, invalidateAlerts }: Partial<ModalProps> & { invalidateAlerts: () => void }) {
  const queryClient = useQueryClient();

  const [patternData, setPatternData] = useState<string>("");

  const { isPending, isError, data: keywords = [], error } = useQueryStatus<string[]>(["keywords"]);

  const addKeywordMutation = useMutation({
    mutationFn: (newKeywords: string) => setKeywords(newKeywords),
    onSuccess: (data, variables) => {
      console.log("Keywords added successfully:", data);
      invalidateKeywords(queryClient); // re‑fetch the list
      setPatternData(""); // clear the input field
      // queryClient.setQueryData<string[]>(['keywords'], (old = []) => [...old, ...data]);
      invalidateAlerts();
    },
    onError: (error) => {
      console.error("Error adding keywords:", error);
    },
  });

  const removeKeywordMutation = useMutation({
    mutationFn: (keyword: string) => removeKeywords(keyword),
    onSuccess: (data) => {
      console.log("Keywords removed successfully:", data);
      invalidateKeywords(queryClient);
      invalidateAlerts();
    },
    onError: (error) => {
      console.error("Error removing keywords:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatternData(value);
  };

  const handleAddPattern = () => {
    const trimmed = patternData.trim();
    if (!trimmed) return;

    addKeywordMutation.mutate(trimmed);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddPattern();
    }
  };

  if (isPending) {
    return <div className="flex h-full w-full items-center justify-center text-text">Loading...</div>;
  }
  if (isError) {
    return <div className="flex h-full w-full items-center justify-center text-text">Error: {error.message}</div>;
  }

  return (
    <div className="relative flex h-[auto] w-full flex-col justify-start bg-transparent text-text">
      <h4 className="mb-xs block text-h4 font-medium">Keywords</h4>
      {/* Status messages */}
      {addKeywordMutation.isIdle && <div className="text-s text-text">Enter a keyword to add</div>}
      {addKeywordMutation.isPending && <div className="text-s text-text">Adding keyword...</div>}
      {addKeywordMutation.isError && <div className="text-s text-error">Error: {addKeywordMutation.error?.message}</div>}
      {addKeywordMutation.isSuccess && <div className="text-s text-success">Keyword added!</div>}
      <div className="grid grid-cols-1 gap-3xs">
        <div className="flex flex-col items-start justify-start gap-2xs rounded-md">
          <div className="flex w-full flex-row items-center justify-start gap-3xs">
            <DefaultInput
              type="text"
              value={patternData}
              onChange={handleChange}
              disabled={addKeywordMutation.isPending || addKeywordMutation.isPaused}
              loading={addKeywordMutation.isPending}
              attributes={{
                name: "keyword",
                placeholder: "Add keyword...",
                onKeyDown: handleKeyPress,
              }}
              stretch="full"
              color="secondary"
              radius={"3xs"}
              slim={true}
              textSize="s"
            />
            <DefaultButton
              onClick={handleAddPattern}
              disabled={addKeywordMutation.isPending || addKeywordMutation.isPaused}
              loading={addKeywordMutation.isPending}
              slim={true}
              radius={"3xs"}
              customTailwind="h-full max-h-full"
            >
              <IoAddOutline className="text-p" />
            </DefaultButton>
          </div>
          <div className="flex flex-wrap text-t text-muted-text">pass comma-separated keywords string (e.g. "error,bad,warning")</div>

          {removeKeywordMutation.isIdle && <div className="text-s text-text">Click a tag to remove keyword</div>}
          {removeKeywordMutation.isPending && <div className="text-s text-text">Removing keyword...</div>}
          {removeKeywordMutation.isError && <div className="text-s text-error">Error: {removeKeywordMutation.error?.message}</div>}
          {removeKeywordMutation.isSuccess && <div className="text-s text-success">Keyword removed!</div>}
          <div className="flex flex-wrap gap-2xs">
            {keywords.length > 0 ? (
              keywords.map((pattern, index) => (
                <div
                  key={`error-pattern-tag-${index}`}
                  className="flex flex-row items-center justify-center gap-2xs rounded-(--spacing-3xs) bg-highlight/20 px-3xs py-4xs text-t text-highlight"
                >
                  <span>{pattern}</span>
                  <IoCloseCircleOutline
                    className="cursor-pointer text-error-500 hover:scale-120"
                    onClick={() => !removeKeywordMutation.isPending && removeKeywordMutation.mutate(pattern)}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center rounded-(--spacing-3xs) bg-accent/20 px-3xs py-4xs text-t text-accent">No keywords found</div>
            )}
            {addKeywordMutation.isPending && (
              <div className="flex animate-pulse items-center rounded-(--spacing-3xs) bg-highlight/30 px-3xs py-4xs text-t text-transparent">
                ADDING KEYWORD
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
