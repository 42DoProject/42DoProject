import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Notifiaction() {
  const [clickFlag, setClickFlag] = useState(0);
  const [notiData, setNotiData] = useState();
  let loginState = useSelector((state) => state.loginReducer);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/user/feed", {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        });
        setNotiData(data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
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

  return (
    <div className="Nav__notification">
      {notiData?.list.length ? (
        <span className="haveNotification">{notiData.list.length}</span>
      ) : (
        <span className="notNotification">{0}</span>
      )}
      <Icon
        className="icon"
        icon="carbon:notification"
        onClick={() => {
          let iconEl = document.querySelector(".icon");
          if (clickFlag === 0) {
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
            {notiData?.length ? (
              notiData.list.map((e, idx) => {
                return (
                  <div key={idx} className="body__card">
                    <div className="card__row1">
                      <div className="card__title">{e.title}</div>
                      <div className="card__date">{e.date}</div>
                    </div>
                    <div className="card__text">{e.text}</div>
                  </div>
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
