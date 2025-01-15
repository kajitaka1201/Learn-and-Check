"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Card from "@/components/ui-elements/card";
import { useState } from "react";
import { v4 as createUUID } from "uuid";
import { downloadFile } from "@/lib/download";
import { uploadFile } from "@/lib/upload";
import VocabularyBook from "@/components/ui-elements/VocabularyBook/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@nextui-org/input";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { UUID } from "crypto";

export type FileType = {
  id: UUID;
  name: string;
  explanation: string;
  contents: {
    id: UUID;
    question: string;
    answer: string;
    isStared: boolean;
  }[];
};
export type ResultType = {
  id: UUID; // same as FileType.id
  contents: {
    id: UUID; // same as FileType.contents.id
    correctRate: number;
    latestResult: boolean;
    lastUpdated: string;
  }[];
};

export default function Create() {
  const [fileData, setFileData] = useState<FileType>({
    name: "",
    explanation: "",
    id: createUUID() as UUID,
    contents: [],
  });
  console.log(fileData);
  const [resultData, setResultData] = useState<ResultType>({
    id: createUUID() as UUID,
    contents: [],
  });
  const [importedCSV, setImportedCSV] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isVocabularyStarted, setIsVocabularyStarted] = useState<boolean>(false);

  function addCard() {
    setFileData({
      ...fileData,
      contents: [
        ...(fileData?.contents || []),
        { question: "", answer: "", id: createUUID() as UUID, isStared: false },
      ],
    });
  }
  function importFromCSV() {
    const csv = importedCSV;
    const lines = csv.split("\n");
    const newContents = lines.map(line => {
      const [question, answer] = line.split("\t");
      return {
        question,
        answer,
        id: createUUID() as UUID,
        isStared: false,
      };
    });
    setFileData({
      ...fileData,
      contents: [...(fileData?.contents || []), ...newContents],
    });
    setIsDialogOpen(false);
  }
  function download() {
    downloadFile({
      name: `${fileData?.name}.learn-and-check.json`,
      content: JSON.stringify(fileData),
    });
  }
  function upload() {
    uploadFile().then(data => {
      setFileData(JSON.parse(data.content));
    });
  }
  function reverseQA() {
    setFileData({
      ...fileData,
      contents: fileData?.contents.map(content => {
        return {
          ...content,
          question: content.answer,
          answer: content.question,
        };
      }),
    });
  }

  useKeyboardShortcut(["ctrl", "m"], e => {
    e.preventDefault();
    addCard();
  });
  useKeyboardShortcut(["ctrl", "s"], e => {
    e.preventDefault();
    download();
  });
  useKeyboardShortcut(["ctrl", "o"], e => {
    e.preventDefault();
    upload();
  });
  useKeyboardShortcut(["ctrl", "enter"], e => {
    e.preventDefault();
    setIsVocabularyStarted(true);
  });

  return (
    <main className="m-auto flex max-w-6xl flex-col gap-6 px-5 py-10">
      <div className="flex flex-col gap-2">
        {/* title input */}
        <Input
          type="text"
          value={fileData?.name}
          onChange={e => setFileData({ ...fileData, name: e.target.value } as FileType)}
          placeholder="タイトル"
          className="flex-1 rounded border border-solid border-gray-400"
        />
        {/* explanation input */}
        <Input
          type="text"
          value={fileData?.explanation}
          onChange={e => setFileData({ ...fileData, explanation: e.target.value } as FileType)}
          placeholder="説明"
          className="flex-1 rounded border border-solid border-gray-400"
        />
      </div>

      <div>
        {/* import dialogue */}
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
          <DialogTrigger asChild>
            <Button className="w-40 rounded-lg p-2">
              CSVからインポートする
            </Button>
          </DialogTrigger>
          <DialogContent className="flex h-4/5 w-4/5 max-w-none flex-col">
            <DialogHeader className="flex-none">
              <DialogTitle>CSVファイルのインポート</DialogTitle>
            </DialogHeader>
            <div className="flex flex-1 flex-col gap-3">
              <Textarea
                className="flex-1"
                value={importedCSV}
                onChange={e => setImportedCSV(e.target.value)}
                placeholder={`GoogleスプレッドシートやExcelからインポートすることが出来ます。\n問題\t答え\n問題\t答え...\nの形式で入力してください。`}
              />
              <Button
                className="w-40 flex-none rounded-lg p-2"
                onClick={importFromCSV}>
                確定する
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button className="w-40 flex-none rounded-lg p-2" onClick={reverseQA}>
          問題と答えを入れ替える
        </Button>
      </div>

      {/* Card */}
      <div className="grid w-full min-w-[12.5rem] list-decimal gap-2">
        {fileData?.contents?.map((content, index) => (
          <Card key={content.id} index={index} content={content} setFileData={setFileData} />
        ))}
        {/* new card */}
        <Button className="m-auto w-40 rounded-lg p-2" onClick={addCard}>
          カードを追加する
        </Button>
      </div>

      {/* button */}
      <div>
        {/* save button */}
        <Button className="w-40 rounded-lg p-2" onClick={download}>
          保存する
        </Button>
        {/* start button */}
        <Button
          className="w-40 rounded-lg p-2"
          disabled={fileData["contents"].length === 0}
          onClick={() => setIsVocabularyStarted(!isVocabularyStarted)}>
          単語帳を開始する
        </Button>
      </div>

      {/* 単語帳 */}
      <VocabularyBook
        fileData={fileData}
        setFileData={setFileData}
        isVocabularyStarted={isVocabularyStarted}
        setIsVocabularyStarted={setIsVocabularyStarted}
      />
    </main>
  );
}
