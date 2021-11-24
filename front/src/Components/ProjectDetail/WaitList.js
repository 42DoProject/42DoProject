import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProjectDetail/WaitList.scss";
import axios from "axios";

export default function WaitList({
  data,
  loginState,
  setApplyFlag,
  positions,
}) {
  const [toggle, setToggle] = useState(false);
  const [waitList, setWaitList] = useState([]);
  const [waitCount, setWaitCount] = useState(0);
  const [isChange, setIsChange] = useState(0);

  useEffect(() => {
    getWaitList();
  }, [toggle, isChange, loginState]);

  const onToggle = (e) => {
    if (toggle === false) {
      setToggle(true);
    } else setToggle(false);
  };

  const getWaitList = async () => {
    console.log(loginState);
    try {
      const {
        data: { applyerList: list },
      } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/apply/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setWaitCount(list.count);
      console.log(waitCount);
      setWaitList(list.rows);
      setIsChange(0);
    } catch (err) {
      console.log(err);
    }
  };

  const applyCancel = (e, id) => {
    axios({
      method: "DELETE",
      url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/apply/${data.id}/${id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setApplyFlag(1);
        setIsChange(1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const onAddMember = (e, id) => {
    axios({
      method: "POST",
      url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/accept/${data.id}/${id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setApplyFlag(1);
        setIsChange(1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  return (
    <>
      <div className="wait__list">
        <div className="waitlist">
          <div className="waitlist__btn" onClick={onToggle}>
            신청 리스트
          </div>
          {waitCount ? (
            <div className="waitlist__count">{waitCount}</div>
          ) : (
            <div className="waitlist__count_zero">{0}</div>
          )}
        </div>
        {toggle && (
          <div className="waitlist__wrap">
            <div className="waitlist__header">
              <div className="waitlist__text">신청 리스트</div>
            </div>
            <div className="waitlist__body">
              {waitList?.length ? (
                waitList.map((elm, key) => {
                  return (
                    <div key={key} className="body__card">
                      <div className="card__row1">
                        <div className="card__img">
                          <img
                            key={key}
                            alt={elm.profile.userId}
                            src={elm.profile.user.profileImage}
                          />
                        </div>
                        <div className="card__name">
                          {elm.profile.user.username}
                        </div>
                        <div className="card__text">
                          {positions[elm.position]}
                        </div>
                        <div className="card__icon">
                          <div className="add-btn">
                            <Icon
                              icon="akar-icons:circle-check-fill"
                              color="#a7bc5b"
                              fontSize="1.5rem"
                              onClick={(e) =>
                                onAddMember(e, elm.profile.userId)
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="cancle-btn">
                            <Icon
                              icon="akar-icons:circle-x-fill"
                              color="#ff6864"
                              fontSize="1.5rem"
                              onClick={(e) =>
                                applyCancel(e, elm.profile.userId)
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="notiText__none">참여 신청자가 없어요</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
