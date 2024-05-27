
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TagSelect() {
  return (
    <Select defaultValue="tags">
      <SelectTrigger className="border-none min-w-[120px] flex items-center justify-between">
        <SelectValue placeholder="Theme" className="" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tags">Create Tags</SelectItem>
        <SelectItem value="groups">Create Groups</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default TagSelect;
