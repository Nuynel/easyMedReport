import React, {useState} from "react";
import MoreVert from "./icons/more_vert.svg";
import BottomSheet from "./BottomSheet";

type ContextMenuProps = {
  options: Record<string, () => void>
}

const ContextMenu = ({options}: ContextMenuProps) => {
  const [isOpen, toggleIsOpen] = useState(false);

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement> ) => {
    e.stopPropagation();
    toggleIsOpen(!isOpen);
  };

  return (
    <div className='relative'>
      <button onClick={handleToggleClick}>
        <MoreVert/>
      </button>
      {isOpen && (<BottomSheet title='ContextMenu' options={options} onClose={() => toggleIsOpen(false)}/>)}
    </div>
  )
}

export default ContextMenu
