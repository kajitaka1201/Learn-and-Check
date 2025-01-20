import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { FormSchema } from "./page";

export default function Settings({
  setSettings,
  start,
}: {
  setSettings: React.Dispatch<React.SetStateAction<FormSchema>>;
  start: () => void;
}) {
  return (
    <article className="grid justify-items-center rounded-2xl border-2 border-blue-600 p-5">
      <h1 className="text-4xl">単語帳設定</h1>
      <Form
        onSubmit={e => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          console.log(data);
          // setSettings(data);
          start();
        }}
        className="grid w-full gap-2">
        <Switch name="useAnswerColumn" value="解答欄機能を使用する" className="w-full" />
        <Switch name="randomQuestion" value="ランダムに出題する" className="w-full" />
        <Switch name="limitToStarred" value="スターが付いた物に限定する" className="w-full" />
        <Button type="submit">スタート</Button>
      </Form>
    </article>
  );
}
