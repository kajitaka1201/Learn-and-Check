import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import Settings from "./settings";
import Use from "./use";
import { FileType } from "@/app/create/page";

export type FormSchema = {
  useAnswerColumn: boolean,
  randomQuestion: boolean,
  limitToStarred: boolean,
};

export default function VocabularyBook({
  fileData,
  setFileData,
  isVocabularyStarted,
  setIsVocabularyStarted,
}: {
  fileData: FileType;
  setFileData: React.Dispatch<React.SetStateAction<FileType>>;
  isVocabularyStarted: boolean;
  setIsVocabularyStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isVocabularyStarted} onOpenChange={setIsVocabularyStarted}>
      <DialogContent
        className="flex h-4/5 w-4/5 max-w-none flex-col"
        onPointerDownOutside={e => e.preventDefault()}>
        {isVocabularyStarted && <DialogBody fileData={fileData} setFileData={setFileData} />}
      </DialogContent>
    </Dialog>
  );
}
function DialogBody({
  fileData,
  setFileData,
}: {
  fileData: FileType;
  setFileData: React.Dispatch<React.SetStateAction<FileType>>;
}) {
  const [mode, setMode] = useState<"set" | "use" | "result">("set");
  const [settings, setSettings] = useState<FormSchema>({
    useAnswerColumn: false,
    randomQuestion: false,
    limitToStarred: false,
  });
  return (
    <>
      <DialogHeader className="flex-none">
        <DialogTitle>単語帳</DialogTitle>
      </DialogHeader>
      {mode === "set" && <Settings setSettings={setSettings} start={() => setMode("use")} />}
      {mode === "use" && <Use fileData={fileData} setFileData={setFileData} Settings={settings} />}
    </>
  );
}
