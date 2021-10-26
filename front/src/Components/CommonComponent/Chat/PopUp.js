import React from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

export const Example = ({ uuid, chatOutFlag, setChatOutFlag, setInFlag }) => {
  return (
    <OverlayTrigger
      trigger="focus"
      placement="bottom"
      overlay={Pop(uuid, chatOutFlag, setChatOutFlag, setInFlag)}
    >
      <Button variant="light">
        <div>
          <Icon
            className="inChat__menu-icon"
            icon="heroicons-outline:menu-alt-4"
          />
        </div>
      </Button>
    </OverlayTrigger>
  );
};

function Pop(uuid, chatOutFlag, setChatOutFlag, setInFlag) {
  const loginState = useSelector((state) => state.loginReducer);
  return (
    <Popover id="popover-basic">
      <div>
        <Popover.Body>채팅방 초대</Popover.Body>
      </div>
      <div
        onClick={() => {
          leaveChat(uuid, loginState, chatOutFlag, setChatOutFlag, setInFlag);
        }}
      >
        <Popover.Body>채팅방 나가기</Popover.Body>
      </div>
      <div className="popover__wrap"></div>
    </Popover>
  );
}

const leaveChat = async (
  uuid,
  loginState,
  chatOutFlag,
  setChatOutFlag,
  setInFlag
) => {
  try {
    const data = await axios.delete(`http://localhost:5000/chat/${uuid}`, {
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    });
    chatOutFlag ? setChatOutFlag(0) : setChatOutFlag(1);
    setInFlag(-1);
  } catch (err) {
    console.log(err);
  }
};
const inviteUser = async (uuid, userIdList, loginState) => {
  await axios({
    method: "POST",
    url: `http://localhost:5000/chat${uuid}`,
    headers: {
      Authorization: `Bearer ${loginState.accessToken}`,
    },
    data: {
      users: [...userIdList],
    },
  });
};
