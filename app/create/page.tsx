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
        { question: "", answer: "", id: createUUID() as UUID },
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
  useKeyboardShortcut(["ctrl", "i"], e => {
    e.preventDefault();
    setIsDialogOpen(true);
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
    <>
      <main className="m-auto max-w-6xl px-5 py-10">
        {/* 設定ボタン類1 */}
        <div>
          {/* ファイルの読み込み用インプット */}
          <Input type="file" accept=".learn-and-check.json" className="hidden" />
          {/* ファイル読み込みボタン */}
          <Button className="w-40 rounded-lg p-2" onClick={upload}>
            ファイルを読み込む
          </Button>
        </div>

        {/* ファイル名インプット */}
        <Input
          type="text"
          defaultValue={fileData?.name}
          onChange={e => setFileData({ ...fileData, name: e.target.value } as FileType)}
          placeholder="タイトル"
          className="flex-1 rounded-[5px] border border-solid border-[#767676]"
        />

        {/* カード部分 */}
        <div className="grid w-full min-w-[12.5rem] list-decimal gap-5">
          {fileData?.contents?.map((content, index) => (
            <Card
              key={content.id}
              index={index}
              content={content}
              setFileData={setFileData}
              resultData={resultData}
              setResultData={setResultData}
            />
          ))}
        </div>

        {/* ボタン類2 */}
        <div>
          {/* カードの追加ボタン */}
          <Button className=" w-40 rounded-lg p-2" onClick={addCard}>
            カードを追加する
          </Button>
          {/* インポートダイアログ */}
          <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
            <DialogTrigger asChild>
              <Button className="w-40 rounded-lg p-2">CSVからインポートする</Button>
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
                <Button className="w-40 flex-none rounded-lg p-2" onClick={importFromCSV}>
                  確定する
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ボタン類3 */}
        <div>
          {/* 保存ボタン */}
          <Button className="w-40 rounded-lg p-2" onClick={download}>
            保存する
          </Button>
          {/* 単語帳開始ボタン */}
          <Button
            className=" inline-flex h-9 w-40 items-center justify-center whitespace-nowrap rounded-lg bg-primary p-2 text-sm font-medium text-primary-foreground shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
    </>
  );
}
