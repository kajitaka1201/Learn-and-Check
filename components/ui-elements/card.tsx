import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileType, ResultType } from "@/app/create/page";

export default function Card({
  index,
  content,
  setFileData,
}: {
  index: number;
  content: FileType["contents"][number];
  setFileData: React.Dispatch<React.SetStateAction<FileType>>;
}) {
  return (
    <div className="mb-2 flex items-center gap-2 border border-gray-300 p-4">
      <span className=" inline-block min-w-[3em] whitespace-nowrap text-right text-xl">
        {index + 1}.
      </span>
      <Input
        type="text"
        defaultValue={content.question}
        onChange={e => {
          setFileData(prev => {
            return {
              ...prev,
              contents:
                prev?.contents.map(c => {
                  if (c.id === content.id) {
                    return { ...c, question: e.target.value };
                  }
                  return c;
                }) || [],
            };
          });
        }}
        placeholder="問題"
        className="min-w-[3rem] flex-1 rounded border border-solid border-gray-400 p-2"
      />
      <Input
        type="text"
        defaultValue={content.answer}
        onChange={e => {
          setFileData(prev => {
            return {
              ...prev,
              contents:
                prev?.contents.map(c => {
                  if (c.id === content.id) {
                    return { ...c, answer: e.target.value };
                  }
                  return c;
                }) || [],
            };
          });
        }}
        placeholder="解答"
        className="min-w-[3rem] flex-1 rounded border border-solid border-gray-400 p-2"
      />
      <Button
        onClick={() =>
          setFileData(prev => {
            return {
              ...prev,
              contents: prev?.contents?.filter(c => c.id !== content.id) || [],
            };
          })
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill={`hsl(var(--primary-foreground))`}
          viewBox="0 0 256 256">
          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
        </svg>
      </Button>
    </div>
  );
}
