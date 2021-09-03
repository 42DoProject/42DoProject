import React from "react";
import { Icon } from '@iconify/react';

export default function ProjectTypeBar() {
	return (
	  <>
	  {/* 모집중인 프로젝트/ 홍보중인 프로젝트(완료) / 필터버튼 */}
	  {/* 각각 버튼으로 바꾸어 주어야함.*/}
	  <div className="project-bar">
		  <div className="project-bar-column1">
		  	<div className="recruit-project">모집중인 프로젝트</div>
		  	<div className="public-project">프로젝트 홍보</div>
		  </div>
		  <div className="project-bar-column2">
		  	<Icon icon="mi:filter" style={{fontSize: '2rem'}} />
		  </div>
	  </div>
	  </>
	);
  }
