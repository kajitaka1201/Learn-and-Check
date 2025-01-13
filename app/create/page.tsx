"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui-elements/card";
import { useState } from "react";
import { v4 as createUUID } from "uuid";
import { downloadFile } from "@/lib/download";
import { uploadFile } from "@/lib/upload";
import VocabularyBook from "@/components/ui-elements/VocabularyBook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ColumnDef } from "@tanstack/react-table";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { UUID } from "crypto";

export type FileType = {
  name: string;
  id: UUID;
  contents: {
    question: string;
    answer: string;
    id: UUID;
    isStared: boolean;
  }[];
};
export type TableType = {
  index: number;
  question: string;
  answer: string;
};
export type ResultType = {
  id: UUID;
  contents: {
    id: UUID;
    correctRate: number;
    latestResult: boolean;
    lastUpdated: string;
  }[];
};
const columns: ColumnDef<TableType>[] = [
  {
    accessorKey: "index",
    header: () => <>No.</>,
    cell: ({ row }) => {
      const index = row.index + 1;
      return <div>{index}</div>;
    },
  },
  {
    accessorKey: "question",
    header: () => <>問題</>,
    cell: ({ row }) => {
      return <div className="text-right">{row.original.question}</div>;
    },
  },
  {
    accessorKey: "answer",
    header: () => <>答え</>,
    cell: ({ row }) => {
      return <div>{row.original.answer}</div>;
    },
  },
];

export default function Create() {
  const [fileData, setFileData] = useState<FileType>({
    name: "",
    id: createUUID() as UUID,
    contents: [],
  });
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
      {/* title input */}
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          defaultValue={fileData?.name}
          onChange={e => setFileData({ ...fileData, name: e.target.value } as FileType)}
          placeholder="タイトル"
          className="flex-1 rounded border border-solid border-gray-400"
        />

        {/* explanation input */}
        <Input
          type="text"
          placeholder="説明"
          className="flex-1 rounded border border-solid border-gray-400"
        />
      </div>

      <div>
        {/* import dialogue */}
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-40 rounded-lg p-2">
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
                variant="outline"
                className="w-40 flex-none rounded-lg p-2"
                onClick={importFromCSV}>
                確定する
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card */}
      <div className="grid w-full min-w-[12.5rem] list-decimal gap-2">
        {fileData?.contents?.map((content, index) => (
          <Card key={content.id} index={index} content={content} setFileData={setFileData} />
        ))}
        {/* new card */}
        <Button variant="outline" className="m-auto w-40 rounded-lg p-2" onClick={addCard}>
          カードを追加する
        </Button>
      </div>

      {/* button */}
      <div>
        {/* save button */}
        <Button variant="outline" className="w-40 rounded-lg p-2" onClick={download}>
          保存する
        </Button>
        {/* start button */}
        <Button
          variant="outline"
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
