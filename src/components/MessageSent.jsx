import { format } from 'date-fns';
import { useContext, useEffect, useRef, useState } from 'react';
import Label from './Label';
import { mdiTrashCanOutline } from '@mdi/js';
import { AuthContext } from './AuthContext';
import useDeleteMessageMutation from '../hooks/useDeleteMessageMutation/useDeleteMessageMutation';

const MessageSent = (props) => {
  const [boxWidth, setBoxWidth] = useState(null);
  const boxRef = useRef(null);
  const { apiUrl, currentUser } = useContext(AuthContext);

  useEffect(() => {
    const boxRect = boxRef.current.getBoundingClientRect();
    setBoxWidth(boxRect.width);
  }, []);

  const deleteMessage = useDeleteMessageMutation(
    props.id,
    props.chatId,
    currentUser,
    apiUrl,
  );

  return (
    <div
      className={`${props.className} group/message mb-1 flex flex-col self-end`}
    >
      <p className="text-tertiary text-right text-xs">
        {props.author.username}
      </p>
      <div className="ml-auto flex items-center justify-end gap-4">
        <Label
          buttonClass="group-hover/message:text-secondary text-transparent rounded-full"
          labelClass={'translate-x-7'}
          icon={mdiTrashCanOutline}
          onClick={() => deleteMessage.mutate()}
        />
        <div ref={boxRef} className="message-sent">
          <div className="text-primary float-right ml-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-white object-cover text-center text-3xl dark:bg-gray-700">
            <p>{props.author.username[0].toUpperCase()}</p>
          </div>
          <p className={`m-3 text-inherit ${boxWidth < 300 && 'flex'}`}>
            {props.body}
          </p>
        </div>
      </div>
      <p className="group-hover/message:text-tertiary text-right text-xs text-transparent transition duration-300">
        {format(props.date, 'pp')}
      </p>
    </div>
  );
};

export default MessageSent;
