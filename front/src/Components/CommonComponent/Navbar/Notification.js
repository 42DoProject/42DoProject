import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import axios from "axios";
import socket from "../../../socket";
import NotiCard from "./NotiCard";

export default function Notifiaction() {
  const [clickFlag, setClickFlag] = useState(0);
  const [notiData, setNotiData] = useState();
  const [unread, setUnread] = useState(0);
  let loginState = useSelector((state) => state.loginReducer);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/feed`,
          {
            headers: {
              Authorization: `Bearer ${loginState.accessToken}`,
            },
          }
        );
        setUnread(data.unread);
        setNotiData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    socket.on("feed:notification", () => {
      getData();
    });
    return () => {
      socket.off("feed:notification");
    };
  }, [loginState]);

  const clickListener = function (e) {
    if (
      clickFlag &&
      document.querySelector(".icon") &&
      e.target.offsetParent &&
      e.target.offsetParent.className !== "notiText__wrap"
    ) {
      let iconEl = document.querySelector(".icon");
      setClickFlag(0);
      iconEl.style.color = "#565656";
    }
  };
  document.body.addEventListener("click", clickListener);

  useEffect(() => {
    const getDataBefore = async (date) => {
      try {
        const { data } = await axios.get(
          `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/feed?date=${date}`,
          {
            headers: {
              Authorization: `Bearer ${loginState.accessToken}`,
            },
          }
        );
        const newNoti = { ...notiData };
        newNoti.list.push(...data);
        setNotiData(newNoti);
      } catch (err) {
        console.log(err);
      }
    };
    const noti__bodyEl = document.querySelector(".notiText__body");
    const handleScrollBottom = () => {
      if (
        noti__bodyEl.scrollTop + noti__bodyEl.clientHeight ===
        noti__bodyEl.scrollHeight
      ) {
        getDataBefore(notiData.list[notiData.list.length - 1].date);
      }
    };
    noti__bodyEl?.addEventListener("scroll", handleScrollBottom);
    return () => {
      noti__bodyEl?.removeEventListener("scroll", handleScrollBottom);
    };
  }, [clickFlag, loginState]);

  return (
    <div className="Nav__notification">
      {unread ? (
        <span className="haveNotification">{unread}</span>
      ) : (
        <span className="notNotification">{unread}</span>
      )}
      <Icon
        className="icon"
        icon="carbon:notification"
        onClick={() => {
          let iconEl = document.querySelector(".icon");
          if (clickFlag === 0) {
            socket.emit("feed:readAt");
            setUnread(0);
            setClickFlag(1);
            iconEl.style.color = "#a7bc5b";
          } else {
            setClickFlag(0);
            iconEl.style.color = "#565656";
          }
        }}
      />
      {clickFlag !== 0 && (
        <div className="notiText__wrap">
          <div className="notiText__header">
            <div className="header__text">알림</div>
          </div>
          <div className="notiText__body">
            {notiData ? (
              notiData.list.map((e, idx) => {
                return (
                  <NotiCard
                    key={idx}
                    date={e.date}
                    type={e.type}
                    args={e.args}
                  />
                );
              })
            ) : (
              <div className="notiText__none">알림이 없어요</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
