import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../SCSS/ProfilePage/Follow.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";
import UnfollowAlert from "./UnfollowAlert";
import FollowCard from "./FollowCard";
import ReactLoading from "../CommonComponent/Loading";

export default function Follow({
  setFollowFlag,
  subject,
  user,
  userId,
  refreshFlag,
  setRefreshFlag,
  myFollowings,
  setGetDataFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const [followerList, setFollowerList] = useState(null); // 보고있는 프로필의 유저id의 팔로워/팔로잉 리스트
  const [followButton, setFollowButton] = useState(); // followButton == "follow"이면 팔로우 버튼, followButton =="unfollow"이면 언팔로우 버튼
  const [unfollowAlert, setUnfollowAlert] = useState(0); // 1일때 unfollowAlert창이 보인다
  const [followUser, setFollowUser] = useState(); // (UnfollowAlert로 보내줄) 언팔로우 버튼이 클릭된 유저
  const [isLoading, setIsLoading] = useState(false);
  const followRef = useRef();
  const loaderRef = useRef();
  const [page, setPage] = useState(1);

  const handleClickOutside = (event) => {
    if (followRef.current && !followRef.current.contains(event.target))
      setFollowFlag(0);
  };

  document.addEventListener("mousedown", handleClickOutside);

  // console.log("user", user);

  /*보고있는 프로필 페이지의 팔로워/팔로잉 리스트 가져오기*/
  const getFollow = async (page) => {
    let subj = "";
    let maxPage = 1;
    if (subject === "팔로워") {
      subj = "follower";
      maxPage = Math.ceil(user.follower / 20);
    } else if (subject === "팔로잉") {
      subj = "following";
      maxPage = Math.ceil(user.following / 20);
    }
    if (maxPage === 0) maxPage = 1;
    if (page <= maxPage) {
      try {
        setIsLoading(true);
        console.log("page / maxPage :", page, maxPage);
        const { data } = await axios.get(
          `${process.env.REACT_APP_HTTP_ENV}://${
            process.env.REACT_APP_BACKEND_DOMAIN
          }/user/${subj}/${userId || loginState.id}?page=${page}`
        );
        if (followerList) {
          setFollowerList([...followerList, ...data]);
        } else {
          setFollowerList(data);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    if (page === maxPage) {
      loaderRef.current.style.display = "none";
    }
  };

  const fetchFollow = async () => {
    getFollow(page + 1);
    setPage(page + 1);
  };

  useEffect(() => {
    getFollow(page);
    refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
  }, [loginState]);

  return (
    <div ref={followRef} className="follow__wrapper">
      <div className="follow__header">
        <div className="box-space"></div>
        <div className="follow__subject">{subject}</div>
        <Icon
          icon="bx:bx-x"
          height="2rem"
          className="follow__x"
          onClick={() => {
            setFollowFlag(0);
          }}
        />
      </div>
      <div className="follow__list">
        {followerList ? (
          followerList.length ? (
            <>
              {followerList.map((v) => {
                return (
                  <FollowCard
                    v={v}
                    key={v.userId}
                    myFollowings={myFollowings}
                    setGetDataFlag={setGetDataFlag}
                    setUnfollowAlert={setUnfollowAlert}
                    setFollowUser={setFollowUser}
                  />
                );
              })}

              <div
                ref={loaderRef}
                className="follow__list-loader"
                onClick={() => fetchFollow()}>
                {isLoading ? (
                  <ReactLoading
                    type="spin"
                    color="#a7bc5b"
                    width="2rem"
                    height="2rem"
                  />
                ) : (
                  <div className="follow__list-more">
                    MORE
                    <Icon icon="dashicons:arrow-down-alt2" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-follow">
              <span>
                아직 {subject}
                {subject === "팔로잉" ? "이" : "가"} 없어요 😯
              </span>
            </div>
          )
        ) : (
          <ReactLoading
            type="spin"
            color="#a7bc5b"
            width="2rem"
            height="2rem"
          />
        )}
      </div>
      {unfollowAlert === 1 && (
        <UnfollowAlert
          setUnfollowAlert={setUnfollowAlert}
          setFollowButton={setFollowButton}
          setGetDataFlag={setGetDataFlag}
          user={followUser}
          userId={followUser.userId}
          setRefreshFlag={setRefreshFlag}
        />
      )}
    </div>
  );
}
