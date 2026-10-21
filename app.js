/**
 * 금호고 스쿨메이트 (Kumho SchoolMate)
 * 금호고등학교 재학생을 위한 실시간 급식, 학사일정, 시간표 웹 애플리케이션
 */

// 1. 기본 설정 및 상수
const CONFIG = {
  ATPT_OFCDC_SC_CODE: 'F10', // 전남광주통합특별시교육청 / 광주광역시교육청
  SD_SCHUL_CODE: '7140341',  // 금호고등학교 NEIS 표준코드
  SCHUL_NM: '금호고등학교',
  API_BASE: 'https://open.neis.go.kr/hub'
};

// 금호고등학교 공식 홈페이지(https://kumho.jge.hs.kr/page.php?id=9&sid=8) 기준 공식 학사일정 마스터 데이터
const KUMHO_OFFICIAL_SCHEDULE = [
  // === 1학기 (2026.03 ~ 2026.08) ===
  { AA_YMD: '20260301', EVENT_NM: '삼일절', EVENT_CNTNT: '삼일절 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260302', EVENT_NM: '대체공휴일', EVENT_CNTNT: '삼일절 대체공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260303', EVENT_NM: '입학식 및 1학기 개학', EVENT_CNTNT: '2026학년도 신입생 입학식 및 개학', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260304', EVENT_NM: '대청소, 신임교사연수', EVENT_CNTNT: '환경정리 대청소', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260308', EVENT_NM: '개교기념일', EVENT_CNTNT: '금호고등학교 개교기념일(1973.03.08)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260310', EVENT_NM: '교육과정설명회 (3학년)', EVENT_CNTNT: '3학년 학부모 대상 교육과정 및 대입설명회', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260312', EVENT_NM: '교육과정설명회 (2학년)', EVENT_CNTNT: '2학년 학부모 대상 교육과정 설명회', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260313', EVENT_NM: '교육과정설명회 (1학년)', EVENT_CNTNT: '1학년 학부모 대상 교육과정 설명회', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260320', EVENT_NM: '학교운영위원회 학부모위원 선출', EVENT_CNTNT: '학운위 학부모위원 선출', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260323', EVENT_NM: '학부모 상담주간 시작 (23~27일)', EVENT_CNTNT: '1학기 학부모 맞춤형 상담주간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260324', EVENT_NM: '전국연합학력평가 (1,2,3학년)', EVENT_CNTNT: '3월 전국연합학력평가 (서울시교육청 주관)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20260401', EVENT_NM: '벚꽃 플리마켓 (1,2,3학년)', EVENT_CNTNT: '지역주민과 함께하는 금호 벚꽃 플리마켓', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260402', EVENT_NM: '학생정부회장 소견발표, 참정권교육', EVENT_CNTNT: '학생회 정부회장 후보 소견발표', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260407', EVENT_NM: '영어듣기평가 (1학년)', EVENT_CNTNT: '1학기 제1회 전국 중고등 영어듣기능력평가(1년)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260408', EVENT_NM: '영어듣기평가 (2학년)', EVENT_CNTNT: '1학기 제1회 전국 중고등 영어듣기능력평가(2년)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260409', EVENT_NM: '학생정부회장 투표 (전학년)', EVENT_CNTNT: '2026학년도 학생정부회장 선거 투표', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260409', EVENT_NM: '영어듣기평가 (3학년)', EVENT_CNTNT: '1학기 제1회 전국 중고등 영어듣기능력평가(3년)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260413', EVENT_NM: '평가원안 공동검토', EVENT_CNTNT: '1차 정기시험 출제원안 공동검토', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260415', EVENT_NM: '학교재량휴업일', EVENT_CNTNT: '금호고등학교 재량휴업일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260427', EVENT_NM: '1차 정기시험 (2,3학년 중간고사 시작)', EVENT_CNTNT: '1학기 1차 정기시험 (2,3학년 시작)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260428', EVENT_NM: '1차 정기시험 (1,2,3학년 중간고사)', EVENT_CNTNT: '1학기 1차 정기시험 (1학년 시작, 전학년 진행)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260429', EVENT_NM: '1차 정기시험 (1,2,3학년 중간고사)', EVENT_CNTNT: '1학기 1차 정기시험 전학년, 교원연수', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260430', EVENT_NM: '1차 정기시험 (1,2,3학년 중간고사 마감)', EVENT_CNTNT: '1학기 1차 정기시험 마지막 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20260501', EVENT_NM: '근로자의 날', EVENT_CNTNT: '노동절', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260505', EVENT_NM: '어린이날', EVENT_CNTNT: '어린이날 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260507', EVENT_NM: '전국연합학력평가 (3학년)', EVENT_CNTNT: '5월 3학년 학력평가 (경기도교육청 주관)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260508', EVENT_NM: '체육한마당 (전학년)', EVENT_CNTNT: '1학기 전교생 체육한마당 행사', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260511', EVENT_NM: '교육과정 박람회, ISWC (11~15일)', EVENT_CNTNT: '교육과정 박람회 및 국제학생웹컨퍼런스 주간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260515', EVENT_NM: '스승의 날', EVENT_CNTNT: '스승의 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260519', EVENT_NM: '수학여행 (1학년) 시작', EVENT_CNTNT: '1학년 테마형 교육여행 1일차', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260520', EVENT_NM: '수학여행 (1학년)', EVENT_CNTNT: '1학년 테마형 교육여행 2일차', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260520', EVENT_NM: '수련회 (2학년)', EVENT_CNTNT: '2학년 야외 수련활동 1일차', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260521', EVENT_NM: '수학여행 (1학년)', EVENT_CNTNT: '1학년 테마형 교육여행 3일차', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260521', EVENT_NM: '수련회 (2학년)', EVENT_CNTNT: '2학년 야외 수련활동 2일차', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260522', EVENT_NM: '수학여행 (1학년 귀교)', EVENT_CNTNT: '1학년 테마형 교육여행 마지막 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260522', EVENT_NM: '수련회 (2학년 귀교)', EVENT_CNTNT: '2학년 야외 수련활동 마지막 날', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260522', EVENT_NM: '진로체험활동 (3학년)', EVENT_CNTNT: '3학년 맞춤형 진로체험활동', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260524', EVENT_NM: '부처님오신날', EVENT_CNTNT: '부처님오신날 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260525', EVENT_NM: '대체공휴일', EVENT_CNTNT: '부처님오신날 대체공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },

  { AA_YMD: '20260604', EVENT_NM: '전국연합학력평가(1,2년), 수능 모의평가(3년)', EVENT_CNTNT: '6월 대수능 모의평가(평가원) 및 학력평가(부산시교육청)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260605', EVENT_NM: '교내 헌혈 (2,3학년)', EVENT_CNTNT: '사랑의 헌혈 행사', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260606', EVENT_NM: '현충일', EVENT_CNTNT: '현충일 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260626', EVENT_NM: '1학기 수행평가 마감', EVENT_CNTNT: '1학기 수행평가 마감일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260629', EVENT_NM: '2차 정기시험 (2,3학년 기말고사 시작)', EVENT_CNTNT: '1학기 2차 정기시험 (2,3학년 시작)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260630', EVENT_NM: '2차 정기시험 (1,2,3학년 기말고사)', EVENT_CNTNT: '1학기 2차 정기시험 (1학년 시작, 전학년 진행)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20260701', EVENT_NM: '2차 정기시험 (1,2,3학년 기말고사)', EVENT_CNTNT: '1학기 2차 정기시험 전학년, 교원연수', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260702', EVENT_NM: '2차 정기시험 (1,2,3학년 기말고사 마감)', EVENT_CNTNT: '1학기 2차 정기시험 마지막 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260708', EVENT_NM: '전국연합학력평가 (3학년)', EVENT_CNTNT: '7월 고3 학력평가(인천시교육청 주관)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260708', EVENT_NM: '진로토크콘서트 (1,2학년)', EVENT_CNTNT: '1,2학년 명사 초청 진로특강', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260710', EVENT_NM: '임팩트메이커 (1,2학년, 10~11일)', EVENT_CNTNT: '학생 맞춤형 주제 탐구 임팩트메이커 캠프', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260714', EVENT_NM: '드림위크 시작 (14~20일)', EVENT_CNTNT: '1학기 자기개발 드림위크 기간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260715', EVENT_NM: '진로프런티어 프로젝트 발표회 (1,2학년)', EVENT_CNTNT: '진로프런티어 연구 프로젝트 결과발표회', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260717', EVENT_NM: '제헌절', EVENT_CNTNT: '제헌절', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260721', EVENT_NM: '1학기 방학식 (여름방학)', EVENT_CNTNT: '여름방학식 / 졸업선배와의 만남(3년)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260722', EVENT_NM: '서울비전트립 (1,2학년, 22~23일)', EVENT_CNTNT: '동문선배와 함께하는 서울비전트립(국회, 대학탐방)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20260810', EVENT_NM: '2학기 개학 (3학년)', EVENT_CNTNT: '3학년 2학기 수업 시작', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260811', EVENT_NM: '2학기 개학 (1,2학년)', EVENT_CNTNT: '1,2학년 2학기 수업 시작', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260812', EVENT_NM: '개학 맞이 대청소', EVENT_CNTNT: '교실 및 교정 대청소', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260815', EVENT_NM: '광복절', EVENT_CNTNT: '광복절 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260817', EVENT_NM: '대체공휴일', EVENT_CNTNT: '광복절 대체공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260819', EVENT_NM: '글로벌리더십교실 (1,2학년)', EVENT_CNTNT: '글로벌리더십 역량강화 프로그램', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260824', EVENT_NM: '학부모 상담주간 시작 (24~28일)', EVENT_CNTNT: '2학기 학부모 맞춤형 상담주간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  // === 2학기 (2026.09 ~ 2027.02) - 학교 공식 홈페이지(https://kumho.jge.hs.kr/page.php?id=9&sid=8) 기준 ===
  { AA_YMD: '20260901', EVENT_NM: '2학기 일과 운영', EVENT_CNTNT: '2학기 9월 일과 운영', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260902', EVENT_NM: '전국연합학력평가(1,2년), 수능모의평가(3년)', EVENT_CNTNT: '평가원 9월 수능모의평가(고3) 및 인천시교육청 전국연합학력평가(고1,2)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260907', EVENT_NM: '수시 원서접수 시작 (3학년, 7~11일)', EVENT_CNTNT: '2027학년도 대입 수시모집 원서접수 기간', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260907', EVENT_NM: '평가원안 공동검토', EVENT_CNTNT: '2학기 1차 정기시험 출제원안 공동검토', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260908', EVENT_NM: '영어듣기평가 (1학년), 독서캠프 (8~10일)', EVENT_CNTNT: '2학기 제2회 전국 영어듣기능력평가(1년) 및 독서캠프', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260909', EVENT_NM: '영어듣기평가 (2학년), 글로벌리더십교실(2차)', EVENT_CNTNT: '2학기 제2회 전국 영어듣기능력평가(2년), 글로벌리더십교실', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260910', EVENT_NM: '영어듣기평가 (3학년)', EVENT_CNTNT: '2학기 제2회 전국 영어듣기능력평가(3년)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260916', EVENT_NM: '저자와의 만남', EVENT_CNTNT: '교내 인문학 특강 저자와의 만남', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260924', EVENT_NM: '추석 연휴', EVENT_CNTNT: '한가위 연휴', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260925', EVENT_NM: '추석 (한가위)', EVENT_CNTNT: '추석 명절', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260926', EVENT_NM: '추석 연휴', EVENT_CNTNT: '한가위 연휴', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20260929', EVENT_NM: '1차 정기시험 (2학년 중간고사 시작)', EVENT_CNTNT: '2026학년도 2학기 1차 정기시험 (2학년 시작)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20260930', EVENT_NM: '1차 정기시험 (1,2,3학년 중간고사)', EVENT_CNTNT: '2026학년도 2학기 1차 정기시험 (1,3학년 시작 / 전학년 진행)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20261001', EVENT_NM: '1차 정기시험 (1,2,3학년 중간고사)', EVENT_CNTNT: '2026학년도 2학기 1차 정기시험 (전학년), 교원연수', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261002', EVENT_NM: '1차 정기시험 (1,2,3학년 중간고사 마감)', EVENT_CNTNT: '2026학년도 2학기 1차 정기시험 마지막 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261003', EVENT_NM: '개천절', EVENT_CNTNT: '개천절 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20261005', EVENT_NM: '대체공휴일 (개천절)', EVENT_CNTNT: '개천절 대체공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20261008', EVENT_NM: '체육한마당 (1,2학년)', EVENT_CNTNT: '2026학년도 2학기 금호고 체육한마당 (1,2학년)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261009', EVENT_NM: '한글날', EVENT_CNTNT: '한글날 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20261014', EVENT_NM: '진로토크콘서트 (2차)', EVENT_CNTNT: '재학생을 위한 진로토크콘서트 2차', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261016', EVENT_NM: '전국체전 출전 (16~22일)', EVENT_CNTNT: '제107회 전국체육대회 기간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261020', EVENT_NM: '전국연합학력평가 (1,2,3학년)', EVENT_CNTNT: '10월 전국연합학력평가 (서울시교육청 주관)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261021', EVENT_NM: 'AI·SW 교육의 날', EVENT_CNTNT: 'AI 인재 양성 및 SW 창의융합 체험의 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261026', EVENT_NM: '심화학술프로그램 (1,2학년, 26~30일)', EVENT_CNTNT: '깊이를 더하는 심화학술 탐구 프로그램', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261028', EVENT_NM: '신임교사 컨설팅수업, 광주비엔날레', EVENT_CNTNT: '컨설팅 수업 및 비엔날레 문화체험', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261030', EVENT_NM: '낭독콘서트', EVENT_CNTNT: '가을 낭독콘서트', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20261103', EVENT_NM: '공감독서한마당 (3~5일)', EVENT_CNTNT: '공감독서한마당 독서주간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261104', EVENT_NM: '온라인 국제교류 프로그램 (1,2학년)', EVENT_CNTNT: '글로벌 자매학교 온라인 교류 세션', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261111', EVENT_NM: '교정 대청소', EVENT_CNTNT: '수능 전 학교 환경정비 대청소', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261117', EVENT_NM: '목요일 수업 대체', EVENT_CNTNT: '시간표 일정에 따른 목요일 수업 대체 진행', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261118', EVENT_NM: '수능 예비소집 (3학년)', EVENT_CNTNT: '2027학년도 대학수학능력시험 수험표 교부 및 예비소집', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261119', EVENT_NM: '대학수학능력시험 (수능 / 1,2학년 재량휴업)', EVENT_CNTNT: '2027학년도 대학수학능력시험 (고사장 운영, 1,2학년 재량휴업)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20261123', EVENT_NM: '평가원안 공동검토', EVENT_CNTNT: '2차 정기시험 출제원안 공동검토', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261125', EVENT_NM: '동아리 발표한마당', EVENT_CNTNT: '창의적 체험활동 동아리 성과 발표회', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20261204', EVENT_NM: '2학기 수행평가 마감', EVENT_CNTNT: '2학기 각 과목 수행평가 반영 최종 마감', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261208', EVENT_NM: '2차 정기시험 (2학년 기말고사 시작)', EVENT_CNTNT: '2026학년도 2학기 2차 정기시험 (2학년 시작)', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261209', EVENT_NM: '2차 정기시험 (1,2학년 기말고사)', EVENT_CNTNT: '2026학년도 2학기 2차 정기시험 (1학년 시작, 2학년 2일차)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261210', EVENT_NM: '2차 정기시험 (1,2학년 기말고사)', EVENT_CNTNT: '2026학년도 2학기 2차 정기시험 (1,2학년), 교육과정연찬회', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261211', EVENT_NM: '2차 정기시험 (1,2학년 기말고사 마감)', EVENT_CNTNT: '2026학년도 2학기 2차 정기시험 마지막 날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261215', EVENT_NM: '학습 점프업 프로그램', EVENT_CNTNT: '기말고사 후 맞춤형 학업 역량 강화 프로그램', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261216', EVENT_NM: '동아리 전시한마당', EVENT_CNTNT: '교내 동아리 작품 및 학술 포스터 전시', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261221', EVENT_NM: '드림위크 시작 (21~24일)', EVENT_CNTNT: '2학기 자기개발 드림위크 기간', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261224', EVENT_NM: '금호고 축제 (금호예술제)', EVENT_CNTNT: '2026학년도 금호고등학교 축제 한마당', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261225', EVENT_NM: '성탄절 (크리스마스)', EVENT_CNTNT: '기독탄신일 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20261228', EVENT_NM: '졸업사정회, 정년퇴임식', EVENT_CNTNT: '졸업사정회 및 선생님 퇴임식', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20261229', EVENT_NM: '방학식 (겨울방학 시작)', EVENT_CNTNT: '2026학년도 2학기 방학식 (금요일 수업 대체)', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20270101', EVENT_NM: '신정 (새해 첫날)', EVENT_CNTNT: '신정 공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20270104', EVENT_NM: '정시 원서접수 시작 (3학년, 4~7일)', EVENT_CNTNT: '2027학년도 대입 정시모집 원서접수 기간', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270114', EVENT_NM: '등교일 (1,2학년)', EVENT_CNTNT: '겨울방학 중 1,2학년 등교일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270115', EVENT_NM: '등교일 (1,2학년)', EVENT_CNTNT: '겨울방학 중 1,2학년 등교일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270118', EVENT_NM: '제49회 졸업식 & 진급사정회', EVENT_CNTNT: '3학년 졸업식 및 1,2학년 진급사정회', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270119', EVENT_NM: '종업식 (1,2학년 학년수료)', EVENT_CNTNT: '1,2학년 등교일 및 2026학년도 종업식', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },

  { AA_YMD: '20270205', EVENT_NM: '기획워크숍', EVENT_CNTNT: '2027학년도 새학기 준비 기획워크숍', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270206', EVENT_NM: '설 연휴', EVENT_CNTNT: '설날 명절 연휴', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20270207', EVENT_NM: '설날', EVENT_CNTNT: '민족 대명절 설날', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20270208', EVENT_NM: '설 연휴', EVENT_CNTNT: '설날 명절 연휴', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20270209', EVENT_NM: '대체공휴일 (설날)', EVENT_CNTNT: '설날 대체공휴일', ONE_GRADE_EVENT_YN: 'Y', TW_GRADE_EVENT_YN: 'Y', THREE_GRADE_EVENT_YN: 'Y', SBTR_DD_SC_NM: '휴업일' },
  { AA_YMD: '20270217', EVENT_NM: '2027학년도 신입생 OT', EVENT_CNTNT: '금호고 예비 1학년 신입생 오리엔테이션', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270218', EVENT_NM: '교직원 워크숍 (1박2일)', EVENT_CNTNT: '새학년 맞이 교직원 워크숍 1일차', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' },
  { AA_YMD: '20270219', EVENT_NM: '교직원 워크숍', EVENT_CNTNT: '새학년 맞이 교직원 워크숍 2일차', ONE_GRADE_EVENT_YN: 'N', TW_GRADE_EVENT_YN: 'N', THREE_GRADE_EVENT_YN: 'N', SBTR_DD_SC_NM: '해당없음' }
];

// 알레르기 유발 물질 19종 목록
const ALLERGEN_DICT = {
  1: '난류(가금류)',
  2: '우유',
  3: '메밀',
  4: '땅콩',
  5: '대두',
  6: '밀',
  7: '고등어',
  8: '게',
  9: '새우',
  10: '돼지고기',
  11: '복숭아',
  12: '토마토',
  13: '아황산염',
  14: '호두',
  15: '닭고기',
  16: '쇠고기',
  17: '오징어',
  18: '조개류(굴/전복/홍합 등)',
  19: '잣'
};

// 금호고등학교 표준 교시별 일과시간 (공식 일과시간표)
const PERIOD_TIMES = {
  1: '08:40 ~ 09:30',
  2: '09:40 ~ 10:30',
  3: '10:40 ~ 11:30',
  4: '11:40 ~ 12:30',
  5: '13:30 ~ 14:20',
  6: '14:30 ~ 15:20',
  7: '15:30 ~ 16:20'
};

// 요일 문자열
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 2. 애플리케이션 상태 (State)
const state = {
  activeTab: 'home',
  currentDate: new Date(),     // 기준 날짜
  mealDate: new Date(),        // 급식 조회 선택 날짜
  scheduleYear: new Date().getFullYear(),
  scheduleMonth: new Date().getMonth() + 1,
  scheduleSelectedYmd: null,   // 달력에서 현재 선택된 날짜 (YYYYMMDD)
  scheduleGradeFilter: '1',    // 기본 학년 필터 (내 학년)
  selectedGrade: 1,
  selectedClass: 1,
  studentProfile: {
    grade: 1,
    classNm: 1
  },
  userAllergens: [],           // 사용자가 체크한 알레르기 번호 목록
  isDark: false,
  isKiosk: false,              // 전자칠판 키오스크 모드 여부
  lastTrackedDay: null,        // 자정 자동 갱신 감지용
  lastTrackedPerio: null,      // 현재 진행 교시 감지용
  timetableMonday: null,       // 주간 시간표 기준 월요일 Date 객체
  customPrimaryDDay: null,     // 현재 선택된 반의 주요 D-Day ({ type, targetYmd, title })
  customPrimaryDDayMap: {},    // 반별 개별 주요 D-Day 맵 ({ "1_1": { type, targetYmd, title }, ... })
  customTimetableMeta: {},     // 사용자 설정 시간표 슬롯 메타 ({ slotKey: { teacher, schedules: [] } })
  cache: {
    meals: {},
    schedules: {},
    timetables: {}
  }
};

// 3. 유틸리티 함수
function getMondayOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0: 일, 1: 월, ..., 6: 토
  // 월요일 자정(00:00:00)에 이번 주 시간표 시작
  // 일요일은 해당 주차의 마지막(일요일 23:59까지는 해당 주간), 월요일 00:00 자정부터 새로운 이번 주 시간표 제공
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDateYYYYMMDD(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function formatDateInput(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateKorean(d, withYear = true) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const date = d.getDate();
  const day = WEEKDAYS[d.getDay()];
  return withYear ? `${y}년 ${m}월 ${date}일 (${day})` : `${m}월 ${date}일 (${day})`;
}

function parseYMDString(str) {
  if (!str || str.length < 8) return new Date();
  const y = parseInt(str.substring(0, 4), 10);
  const m = parseInt(str.substring(4, 6), 10) - 1;
  const d = parseInt(str.substring(6, 8), 10);
  return new Date(y, m, d);
}

// 토스트 메시지 띄우기
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
  }, 2300);
}

// 4. 로컬 스토리지 데이터 관리
function loadPreferences() {
  try {
    // 구버전 가상/회전/불완전 시간표 캐시 전량 강제 소거
    try {
      const keysToPurge = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k !== 'kumho_timetable_meta' && (k.startsWith('kumho_weekly_') || k.startsWith('kumho_timetable_') || k.startsWith('kumho_real_v'))) {
          keysToPurge.push(k);
        }
      }
      keysToPurge.forEach(k => localStorage.removeItem(k));
    } catch (e) {}

    // API 키 잔여 데이터가 남아있다면 영구 정리
    try { localStorage.removeItem('kumho_neis_api_key'); } catch (e) {}

    const savedProfile = localStorage.getItem('kumho_student_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      state.studentProfile = { ...state.studentProfile, ...parsed };
      let g = parseInt(state.studentProfile.grade, 10) || 1;
      let c = parseInt(state.studentProfile.classNm, 10) || 1;
      if (g !== 1) g = 1;
      if (c < 1 || c > 9) c = 1;
      state.selectedGrade = g;
      state.selectedClass = c;
      state.studentProfile.grade = g;
      state.studentProfile.classNm = c;
      state.scheduleGradeFilter = String(state.selectedGrade);
    } else {
      const savedGrade = localStorage.getItem('kumho_my_grade');
      const savedClass = localStorage.getItem('kumho_my_class');
      if (savedGrade) {
        let g = parseInt(savedGrade, 10) || 1;
        if (g !== 1) g = 1;
        state.selectedGrade = g;
        state.studentProfile.grade = g;
      }
      if (savedClass) {
        let c = parseInt(savedClass, 10) || 1;
        if (c < 1 || c > 9) c = 1;
        state.selectedClass = c;
        state.studentProfile.classNm = c;
      }
      state.scheduleGradeFilter = String(state.selectedGrade);
    }

    const savedAllergens = localStorage.getItem('kumho_allergens');
    if (savedAllergens) state.userAllergens = JSON.parse(savedAllergens);

    const savedTheme = localStorage.getItem('kumho_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }

    const savedDDayMap = localStorage.getItem('kumho_primary_dday_by_class');
    if (savedDDayMap) {
      try {
        state.customPrimaryDDayMap = JSON.parse(savedDDayMap) || {};
      } catch (e) {
        state.customPrimaryDDayMap = {};
      }
    } else {
      // 기존 단일 D-Day 데이터가 있으면 현재 선택된 반의 초기값으로 마이그레이션 후 단일 키 제거
      const legacyDDay = localStorage.getItem('kumho_primary_dday');
      if (legacyDDay) {
        try {
          const parsedLegacy = JSON.parse(legacyDDay);
          if (parsedLegacy && parsedLegacy.targetYmd) {
            const curKey = `${state.selectedGrade}_${state.selectedClass}`;
            state.customPrimaryDDayMap = { [curKey]: parsedLegacy };
            localStorage.setItem('kumho_primary_dday_by_class', JSON.stringify(state.customPrimaryDDayMap));
          }
          localStorage.removeItem('kumho_primary_dday');
        } catch (e) {}
      }
    }
    syncCurrentClassPrimaryDDay();

    const savedTimetableMeta = localStorage.getItem('kumho_timetable_meta');
    if (savedTimetableMeta) {
      try {
        state.customTimetableMeta = JSON.parse(savedTimetableMeta) || {};
      } catch (e) {
        state.customTimetableMeta = {};
      }
    }

    updateStudentBadge();
  } catch (e) {
    console.error('Error loading preferences', e);
  }
}

// 반별 개별 주요 D-Day 조회/저장 헬퍼
function getClassDDayKey(grade = state.selectedGrade, classNm = state.selectedClass) {
  return `${grade || 1}_${classNm || 1}`;
}

function syncCurrentClassPrimaryDDay(grade = state.selectedGrade, classNm = state.selectedClass) {
  const key = getClassDDayKey(grade, classNm);
  if (!state.customPrimaryDDayMap) state.customPrimaryDDayMap = {};
  state.customPrimaryDDay = state.customPrimaryDDayMap[key] || null;
  return state.customPrimaryDDay;
}

function saveClassPrimaryDDay(ddayObj, grade = state.selectedGrade, classNm = state.selectedClass) {
  const key = getClassDDayKey(grade, classNm);
  if (!state.customPrimaryDDayMap) state.customPrimaryDDayMap = {};
  if (ddayObj && ddayObj.targetYmd) {
    state.customPrimaryDDayMap[key] = ddayObj;
    state.customPrimaryDDay = ddayObj;
  } else {
    delete state.customPrimaryDDayMap[key];
    state.customPrimaryDDay = null;
  }
  try {
    localStorage.setItem('kumho_primary_dday_by_class', JSON.stringify(state.customPrimaryDDayMap));
  } catch (e) {
    console.error('Error saving class primary D-Day:', e);
  }
}

function saveCustomTimetableMeta() {
  try {
    localStorage.setItem('kumho_timetable_meta', JSON.stringify(state.customTimetableMeta || {}));
  } catch (e) {
    console.error('Error saving custom timetable meta:', e);
  }
}

// 4-1. 시간표 슬롯(선생님 성함 / 일정) 커스텀 데이터 관리
let currentActiveSlot = null;

function formatTeacherName(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.endsWith('T') || trimmed.endsWith('t')) {
    return trimmed.slice(0, -1) + 'T';
  }
  return `${trimmed}T`;
}

// 주차별 슬롯 일정 조회 헬퍼 (해당 주차에만 유효)
function getSlotSchedulesForWeek(meta, weekMondayYmd) {
  if (!meta) return [];
  if (meta.weeklySchedules && meta.weeklySchedules[weekMondayYmd]) {
    return Array.isArray(meta.weeklySchedules[weekMondayYmd]) ? meta.weeklySchedules[weekMondayYmd] : [];
  }
  return [];
}

// ========================================================
// 체육 수업 전용 날씨 및 강수 예보 & 시간표 슬롯 태그 관리
// ========================================================
const PE_WEATHER_CACHE = {};

// 체육 수업 시간대 날씨 및 강수 예보 조회 (Open-Meteo API + 정밀 계절 예측)
async function getPeClassWeather(ymdString, perioNumber) {
  const cleanYmd = (ymdString || '').replace(/-/g, '');
  const year = parseInt(cleanYmd.substring(0, 4), 10) || new Date().getFullYear();
  const month = parseInt(cleanYmd.substring(4, 6), 10) || (new Date().getMonth() + 1);
  const day = parseInt(cleanYmd.substring(6, 8), 10) || new Date().getDate();
  const p = parseInt(perioNumber, 10) || 1;

  // 교시별 기준 시각 (1교시: 9시, 2교시: 10시, ..., 7교시: 16시)
  const periodHours = { 1: 9, 2: 10, 3: 11, 4: 12, 5: 14, 6: 15, 7: 16 };
  const targetHour = periodHours[p] || 10;
  const hourPadded = String(targetHour).padStart(2, '0');
  const cacheKey = `${cleanYmd}_p${p}`;

  if (PE_WEATHER_CACHE[cacheKey]) {
    return PE_WEATHER_CACHE[cacheKey];
  }

  let weatherData = null;

  try {
    // 광주광역시 북구 운암동 금호고등학교 좌표: 위도 35.176, 경도 126.883
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=35.176&longitude=126.883&hourly=temperature_2m,precipitation_probability,precipitation,weathercode&timezone=Asia%2FSeoul&forecast_days=7';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.hourly && data.hourly.time) {
        const targetIsoTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hourPadded}:00`;
        const timeIndex = data.hourly.time.findIndex(t => t.startsWith(targetIsoTime.substring(0, 13)));

        if (timeIndex !== -1) {
          const temp = Math.round(data.hourly.temperature_2m[timeIndex] * 10) / 10;
          const precipMm = Math.round((data.hourly.precipitation[timeIndex] || 0) * 10) / 10;
          const precipProb = data.hourly.precipitation_probability[timeIndex] || 0;
          const code = data.hourly.weathercode[timeIndex] || 0;

          const cond = parseWmoWeather(code, precipMm, precipProb);
          weatherData = {
            temp: temp,
            precipMm: precipMm,
            precipProb: precipProb,
            icon: cond.icon,
            statusText: cond.statusText,
            isRain: cond.isRain,
            tip: cond.tip
          };
        }
      }
    }
  } catch (err) {
    // 오프라인이거나 시간 초과 시 아래 정밀 모델로 폴백
  }

  if (!weatherData) {
    weatherData = generateFallbackWeather(month, day, targetHour);
  }

  PE_WEATHER_CACHE[cacheKey] = weatherData;
  return weatherData;
}

function parseWmoWeather(code, precipMm, precipProb) {
  if (code >= 95) {
    return {
      icon: '⛈️',
      statusText: '뇌우',
      isRain: true,
      tip: '⚠️ 낙뢰/폭우 주의! 실내체육관(금호관) 수업 권장'
    };
  } else if (code >= 80 || (code >= 51 && code <= 67) || precipMm >= 0.5 || precipProb >= 60) {
    return {
      icon: '🌧️',
      statusText: code >= 80 ? '소나기' : '비',
      isRain: true,
      tip: `⚠️ 강수 예보(${precipMm}mm, ${precipProb}%) - 운동장이 젖어 실내체육관(금호관) 수업 권장`
    };
  } else if (code >= 71 && code <= 77) {
    return {
      icon: '❄️',
      statusText: '눈',
      isRain: true,
      tip: '❄️ 눈 예보 - 야외 운동장 미끄럼 주의! 실내체육관 수업 권장'
    };
  } else if (code === 3) {
    return {
      icon: '☁️',
      statusText: '흐림',
      isRain: false,
      tip: '☁️ 흐린 날씨 - 비는 오지 않아 야외 운동장 체육 수업 가능 ⚽'
    };
  } else if (code === 1 || code === 2) {
    return {
      icon: '⛅',
      statusText: '구름조금',
      isRain: false,
      tip: '⛅ 선선하고 쾌적한 날씨 - 야외 운동장 체육 수업에 매우 적합 🏃'
    };
  } else {
    return {
      icon: '☀️',
      statusText: '맑음',
      isRain: false,
      tip: '☀️ 맑고 상쾌한 날씨 - 야외 운동장 체육 활동 최적 (충분한 수분 섭취) ⚽'
    };
  }
}

function generateFallbackWeather(month, day, targetHour) {
  const monthlyBaseTemp = {
    1: 1, 2: 3, 3: 8, 4: 14, 5: 19, 6: 23,
    7: 26, 8: 27, 9: 22, 10: 16, 11: 10, 12: 3
  };
  const base = monthlyBaseTemp[month] || 18;
  const hourOffset = (targetHour >= 12 && targetHour <= 16) ? 3.5 : (targetHour >= 9 && targetHour <= 11) ? 1.5 : 0;
  const temp = Math.round((base + hourOffset) * 10) / 10;

  const seed = (month * 31 + day + targetHour) % 10;
  if (seed === 7) {
    return {
      temp: temp - 2,
      precipMm: 1.5,
      precipProb: 70,
      icon: '🌧️',
      statusText: '약한 비',
      isRain: true,
      tip: '⚠️ 비 예보(1.5mm, 70%) - 운동장 사용 제한, 실내체육관(금호관) 수업 권장'
    };
  } else if (seed === 3 || seed === 8) {
    return {
      temp: temp,
      precipMm: 0.0,
      precipProb: 20,
      icon: '⛅',
      statusText: '구름많음',
      isRain: false,
      tip: '⛅ 구름이 햇빛을 가려 야외 운동장 체육 수업에 쾌적합니다. 🏃'
    };
  } else {
    return {
      temp: temp,
      precipMm: 0.0,
      precipProb: 10,
      icon: '☀️',
      statusText: '맑음',
      isRain: false,
      tip: '☀️ 맑고 상쾌한 날씨 - 야외 운동장 체육 활동 진행에 매우 적합합니다. ⚽'
    };
  }
}

// 준비물 텍스트에 일치하는 적절한 이모티콘 반환 함수
function getSupplyEmoji(rawText) {
  const t = (rawText || '').toLowerCase();
  if (t.includes('노트북') || t.includes('notebook') || t.includes('laptop') || t.includes('컴퓨터') || t.includes('태블릿') || t.includes('아이패드') || t.includes('크롬북')) return '💻';
  if (t.includes('체육복') || t.includes('운동복') || t.includes('반티') || t.includes('여벌옷') || t.includes('유니폼')) return '👕';
  if (t.includes('운동화') || t.includes('실내화') || t.includes('축구화') || t.includes('신발')) return '👟';
  if (t.includes('축구')) return '⚽';
  if (t.includes('농구')) return '🏀';
  if (t.includes('배드민턴') || t.includes('라켓') || t.includes('셔틀콕')) return '🏸';
  if (t.includes('야구')) return '⚾';
  if (t.includes('탁구')) return '🏓';
  if (t.includes('배구')) return '🏐';
  if (t.includes('미술') || t.includes('물감') || t.includes('붓') || t.includes('팔레트') || t.includes('스케치북') || t.includes('도화지') || t.includes('크레파스') || t.includes('파스텔') || t.includes('포스터') || t.includes('캔버스')) return '🎨';
  if (t.includes('가위') || t.includes('칼') || t.includes('커터')) return '✂️';
  if (t.includes('삼각자') || t.includes('각도기') || t.includes('컴퍼스')) return '📐';
  if (t.includes('자') || t.includes('줄자')) return '📏';
  if (t.includes('풀') || t.includes('딱풀') || t.includes('물풀') || t.includes('본드') || t.includes('접착제')) return '🧴';
  if (t.includes('계산기') || t.includes('주판')) return '🧮';
  if (t.includes('색연필') || t.includes('연필') || t.includes('샤프') || t.includes('볼펜') || t.includes('형광펜') || t.includes('사인펜') || t.includes('마카') || t.includes('네임펜') || t.includes('필기구') || t.includes('컴싸') || t.includes('지우개')) return '✏️';
  if (t.includes('실험복') || t.includes('가운') || t.includes('보안경') || t.includes('장갑')) return '🥼';
  if (t.includes('실험') || t.includes('현미경') || t.includes('비커') || t.includes('과학')) return '🔬';
  if (t.includes('리코더') || t.includes('단소') || t.includes('소금') || t.includes('악기') || t.includes('기타') || t.includes('우쿨렐레') || t.includes('탬버린') || t.includes('캐스터네츠') || t.includes('음악') || t.includes('악보')) return '🎵';
  if (t.includes('이어폰') || t.includes('헤드셋') || t.includes('헤드폰') || t.includes('에어팟')) return '🎧';
  if (t.includes('충전기') || t.includes('배터리') || t.includes('보조배터리') || t.includes('케이블')) return '🔋';
  if (t.includes('카메라') || t.includes('사진')) return '📷';
  if (t.includes('우산') || t.includes('우비') || t.includes('양산')) return '☂️';
  if (t.includes('텀블러') || t.includes('물병') || t.includes('물통') || t.includes('음료') || t.includes('물')) return '🥤';
  if (t.includes('도시락') || t.includes('간식') || t.includes('요리') || t.includes('앞치마') || t.includes('식재료')) return '🍱';
  if (t.includes('바느질') || t.includes('바늘') || t.includes('실') || t.includes('뜨개질') || t.includes('천')) return '🪡';
  if (t.includes('지도') || t.includes('지구본') || t.includes('부도')) return '🗺️';
  if (t.includes('사전') || t.includes('단어장') || t.includes('옥편')) return '📕';
  if (t.includes('교과서') || t.includes('문제집') || t.includes('교재') || t.includes('학습지') || t.includes('프린트') || t.includes('유인물') || t.includes('파일') || t.includes('바인더') || t.includes('공책') || t.includes('노트') || t.includes('연습장')) return '📒';
  if (t.includes('학생증') || t.includes('신분증')) return '🪪';
  if (t.includes('마스크')) return '😷';
  if (t.includes('돗자리') || t.includes('담요') || t.includes('방석')) return '🧺';
  if (t.includes('줄넘기')) return '🪢';
  // 기본 준비물 이모티콘 (가방)
  return '🎒';
}

// 시간표 슬롯 배지 표시 내용 결정 함수
// - 준비물 태그: 그 준비물에 일치하는 적절한 이모티콘 (배경색 제거 & 크기 확대)
// - 숙제 태그: 책 이모티콘 📚 (배경색 제거 & 크기 확대)
// 단일 일정 항목을 배지 객체로 변환
function parseSingleScheduleBadge(schedule) {
  if (!schedule) return null;
  const tag = schedule.tag || '';
  const text = schedule.text || '';

  // 1) 준비물 태그 -> 품목 맞춤 이모티콘 (배경 없음, 확대)
  if (tag === '준비물') {
    const emoji = getSupplyEmoji(text);
    return {
      type: '준비물',
      text: emoji,
      isEmoji: true,
      badgeClass: 'is-emoji',
      bgHex: 'transparent',
      title: `준비물: ${text}`
    };
  }

  // 2) 숙제 태그 -> 책 이모티콘 📚 (배경 없음, 확대)
  if (tag === '숙제') {
    return {
      type: '숙제',
      text: '📚',
      isEmoji: true,
      badgeClass: 'is-emoji',
      bgHex: 'transparent',
      title: `숙제: ${text}`
    };
  }

  // 3) 수행평가 태그 -> '수행' (로즈 레드 배지)
  if (tag === '수행' || tag === '수행평가') {
    return {
      type: '수행',
      text: '수행',
      isEmoji: false,
      badgeClass: 'badge-suhaeng',
      bgHex: '#E11D48',
      title: `수행평가: ${text}`
    };
  }

  // 4) 기타 태그 -> '기타' (바이올렛 배지)
  if (tag === '기타') {
    return {
      type: '기타',
      text: '기타',
      isEmoji: false,
      badgeClass: 'badge-etc',
      bgHex: '#7C3AED',
      title: `기타: ${text}`
    };
  }

  // 레거시 데이터 호환: 텍스트에 노트북 등 키워드가 있는 경우
  if (text.toLowerCase().includes('노트북')) {
    return {
      type: '준비물',
      text: '💻',
      isEmoji: true,
      badgeClass: 'is-emoji',
      bgHex: 'transparent',
      title: `준비물: ${text}`
    };
  }

  return {
    type: '기타',
    text: '일정',
    isEmoji: false,
    badgeClass: 'badge-suhaeng',
    bgHex: '#E11D48',
    title: text || '등록된 일정'
  };
}

// 2가지 이상의 태그/일정이 있는 경우 모두 순서대로 반환
function getAllSlotBadgesDisplay(schedules) {
  if (!schedules || schedules.length === 0) return [];
  const badges = [];
  schedules.forEach(item => {
    const b = parseSingleScheduleBadge(item);
    if (b) badges.push(b);
  });
  return badges;
}

// 하위 호환용 (단일 배지 반환)
function getSlotBadgeDisplay(schedules) {
  const badges = getAllSlotBadgesDisplay(schedules);
  if (badges.length === 0) return null;
  return badges[badges.length - 1];
}

// 단일 일정 배지 헬퍼 별칭 (모바일/데스크톱 공통 안전 호출 보장)
const getSingleScheduleBadgeDisplay = parseSingleScheduleBadge;

// 슬롯 모달 태그 버튼 활성화 UI 갱신 함수 (수행평가 / 준비물 / 숙제 / 기타 4색 구분)
function setSlotActiveTag(tag) {
  if (!currentActiveSlot) return;
  currentActiveSlot.selectedTag = tag;

  const selector = document.getElementById('slot-tag-selector');
  const inputEl = document.getElementById('input-slot-new-schedule');
  if (selector) {
    selector.querySelectorAll('.slot-tag-btn').forEach(btn => {
      const btnTag = btn.dataset.tag;
      btn.classList.remove(
        'active-tag-suhaeng', 'active-tag-junbi', 'active-tag-sukje', 'active-tag-etc',
        'bg-rose-600', 'bg-amber-500', 'bg-emerald-600', 'bg-violet-600', 'bg-slate-700',
        'text-white', 'border-rose-600', 'border-amber-600', 'border-emerald-600', 'border-violet-600', 'border-slate-800', 'shadow-xs'
      );
      btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');

      if (btnTag === tag) {
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
        if (tag === '수행') {
          btn.classList.add('active-tag-suhaeng', 'bg-rose-600', 'text-white', 'border-rose-600', 'shadow-xs');
        } else if (tag === '준비물') {
          btn.classList.add('active-tag-junbi', 'bg-amber-500', 'text-white', 'border-amber-600', 'shadow-xs');
        } else if (tag === '숙제') {
          btn.classList.add('active-tag-sukje', 'bg-emerald-600', 'text-white', 'border-emerald-600', 'shadow-xs');
        } else {
          btn.classList.add('active-tag-etc', 'bg-violet-600', 'text-white', 'border-violet-600', 'shadow-xs');
        }
      }
    });
  }

  if (inputEl) {
    if (tag === '수행') {
      inputEl.placeholder = '수행평가 내용 입력 (예: 역사 발표 과제, 수학 서술형)';
    } else if (tag === '준비물') {
      inputEl.placeholder = '준비물 입력 시 맞춤 이모티콘 표시 (예: 노트북, 체육복, 물감, 계산기)';
    } else if (tag === '숙제') {
      inputEl.placeholder = '숙제 내용 입력 시 📚 이모티콘 표시 (예: 수학 익힘책 45p 풀어오기)';
    } else {
      inputEl.placeholder = '기타 일정/메모 입력 (예: 자리 배치 변경, 설문 제출)';
    }
  }
}

// 공강, 수요일 6~7교시(자율·자치활동), 진로활동 시간에는 담당 선생님 추가/표시 제외 판별 함수
function isTeacherDisabledSlot(subject, dayIndex, perio) {
  const s = (subject || '').trim();
  const d = parseInt(dayIndex, 10);
  const p = parseInt(perio, 10);
  // 1) 공강 시간
  if (s === '공강' || s.includes('공강')) return true;
  // 2) 수요일(dayIndex=3) 6~7교시 또는 자율·자치활동
  if ((d === 3 && (p === 6 || p === 7)) || s.includes('자율·자치') || s.includes('자율자치')) return true;
  // 3) 진로활동 (월요일 1교시 등)
  if (s.includes('진로활동')) return true;
  return false;
}

function openTimetableSlotModal(slotKey, grade, classNm, dayIndex, dayName, perio, subject, weekMonday) {
  const g = parseInt(grade, 10) || state.selectedGrade || 1;
  const c = parseInt(classNm, 10) || state.selectedClass || 1;
  const dIdx = parseInt(dayIndex, 10) || 1;
  const dName = dayName || '월';
  const p = parseInt(perio, 10) || 1;
  const subj = (subject ? decodeURIComponent(subject) : '수업');
  const key = slotKey || `g${g}_c${c}_d${dIdx}_p${p}`;
  const currentWeekMonday = weekMonday || (state.timetableMonday ? formatDateYYYYMMDD(state.timetableMonday) : formatDateYYYYMMDD(getMondayOfWeek(state.currentDate)));
  const hideTeacher = isTeacherDisabledSlot(subj, dIdx, p);

  currentActiveSlot = {
    slotKey: key,
    weekMonday: currentWeekMonday,
    grade: g,
    classNm: c,
    dayIndex: dIdx,
    dayName: dName,
    perio: p,
    subject: subj,
    hideTeacher: hideTeacher,
    selectedTag: '수행',
    schedules: []
  };

  const titleEl = document.getElementById('modal-timetable-slot-title');
  const subEl = document.getElementById('modal-timetable-slot-sub');
  const teacherSection = document.getElementById('slot-teacher-section');
  const teacherInput = document.getElementById('input-slot-teacher');
  const newScheduleInput = document.getElementById('input-slot-new-schedule');

  if (titleEl) titleEl.textContent = `${dName}요일 ${p}교시 · ${subj}`;
  if (subEl) {
    const mondayObj = parseYMDString(currentWeekMonday);
    const fridayObj = new Date(mondayObj.getFullYear(), mondayObj.getMonth(), mondayObj.getDate() + 4);
    const weekStr = `${mondayObj.getMonth() + 1}.${mondayObj.getDate()}~${fridayObj.getMonth() + 1}.${fridayObj.getDate()}`;
    subEl.textContent = hideTeacher
      ? `${g}학년 ${c}반 · ${weekStr} 주간 일정 관리`
      : `${g}학년 ${c}반 · ${weekStr} 주간 일정 및 담당 선생님`;
  }

  // 공강, 수요일 6~7교시, 진로활동 시간에는 담당 선생님 성함 입력란 숨김
  if (teacherSection) {
    if (hideTeacher) {
      teacherSection.classList.add('hidden');
    } else {
      teacherSection.classList.remove('hidden');
    }
  }

  // 태그 초기화: 기본값 '수행'
  setSlotActiveTag('수행');

  const meta = (state.customTimetableMeta && state.customTimetableMeta[key]) || {};
  let teacher = hideTeacher ? '' : (meta.teacher || '');
  if (teacherInput) teacherInput.value = teacher.replace(/T$/i, '');

  const weekSchedules = getSlotSchedulesForWeek(meta, currentWeekMonday);
  currentActiveSlot.schedules = JSON.parse(JSON.stringify(weekSchedules));
  if (newScheduleInput) newScheduleInput.value = '';

  renderSlotSchedulesList();
  openModal('modal-timetable-detail');
}
window.openTimetableSlotModal = openTimetableSlotModal;

function renderSlotSchedulesList() {
  const listEl = document.getElementById('slot-schedule-list');
  const countEl = document.getElementById('slot-schedule-badge-count');
  if (!listEl) return;

  const schedules = (currentActiveSlot && currentActiveSlot.schedules) || [];
  if (countEl) countEl.textContent = `${schedules.length}개`;

  if (schedules.length === 0) {
    listEl.innerHTML = '<div class="py-4 text-center text-slate-400 text-[11px]">해당 주에 등록된 일정이 없습니다.</div>';
    return;
  }

  listEl.innerHTML = schedules.map((item, idx) => {
    const tag = item.tag || '수행';
    const text = item.text || '';

    let tagBadge = '';
    if (tag === '수행' || tag === '수행평가') {
      tagBadge = '<span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 shrink-0">📝 수행</span>';
    } else if (tag === '준비물') {
      const supplyIcon = getSupplyEmoji(text);
      tagBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 shrink-0 flex items-center gap-0.5"><span>${supplyIcon}</span><span>준비물</span></span>`;
    } else if (tag === '숙제') {
      tagBadge = '<span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0 flex items-center gap-0.5"><span>📚</span><span>숙제</span></span>';
    } else {
      tagBadge = '<span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 shrink-0">📌 기타</span>';
    }

    return `
      <div class="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
        <div class="flex items-center space-x-2 truncate flex-1 min-w-0 pr-2">
          ${tagBadge}
          <span class="text-xs text-slate-800 dark:text-slate-100 font-medium truncate">${text}</span>
        </div>
        <button type="button" class="btn-delete-schedule p-1 text-slate-400 hover:text-rose-500 rounded-lg transition shrink-0" data-idx="${idx}" title="일정 삭제">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function addSlotSchedule() {
  if (!currentActiveSlot) return;
  const newScheduleInput = document.getElementById('input-slot-new-schedule');
  if (!newScheduleInput) return;
  const text = newScheduleInput.value.trim();
  if (!text) {
    newScheduleInput.focus();
    return;
  }
  if (!currentActiveSlot.schedules) currentActiveSlot.schedules = [];
  const selectedTag = currentActiveSlot.selectedTag || '수행';
  currentActiveSlot.schedules.push({
    id: Date.now() + Math.random().toString(36).substring(2, 6),
    text: text,
    tag: selectedTag,
    createdAt: new Date().toISOString()
  });
  newScheduleInput.value = '';
  renderSlotSchedulesList();
  newScheduleInput.focus();
}

function saveCurrentSlotMeta() {
  if (!currentActiveSlot || !currentActiveSlot.slotKey) return;
  const teacherInput = document.getElementById('input-slot-teacher');
  const rawTeacher = (!currentActiveSlot.hideTeacher && teacherInput) ? teacherInput.value.trim() : '';
  const formattedTeacher = currentActiveSlot.hideTeacher ? '' : formatTeacherName(rawTeacher);
  const schedules = currentActiveSlot.schedules || [];
  const weekMonday = currentActiveSlot.weekMonday;

  if (!state.customTimetableMeta) state.customTimetableMeta = {};
  if (!state.customTimetableMeta[currentActiveSlot.slotKey]) {
    state.customTimetableMeta[currentActiveSlot.slotKey] = {};
  }

  const slotMeta = state.customTimetableMeta[currentActiveSlot.slotKey];
  slotMeta.teacher = formattedTeacher;
  if (!slotMeta.weeklySchedules) slotMeta.weeklySchedules = {};

  if (schedules.length > 0) {
    slotMeta.weeklySchedules[weekMonday] = schedules;
  } else {
    delete slotMeta.weeklySchedules[weekMonday];
  }

  // 선생님 및 주차별 일정 모두 비어있을 시 키 삭제
  if (!slotMeta.teacher && Object.keys(slotMeta.weeklySchedules).length === 0) {
    delete state.customTimetableMeta[currentActiveSlot.slotKey];
  }

  saveCustomTimetableMeta();
  closeModal('modal-timetable-detail');
  showToast('시간표 정보가 저장되었습니다.');

  renderTimetable(state.selectedGrade, state.selectedClass);
}

function clearCurrentSlotMeta() {
  if (!currentActiveSlot || !currentActiveSlot.slotKey) return;
  const teacherInput = document.getElementById('input-slot-teacher');
  if (teacherInput) teacherInput.value = '';
  currentActiveSlot.schedules = [];
  renderSlotSchedulesList();

  if (state.customTimetableMeta && state.customTimetableMeta[currentActiveSlot.slotKey]) {
    const slotMeta = state.customTimetableMeta[currentActiveSlot.slotKey];
    slotMeta.teacher = '';
    if (slotMeta.weeklySchedules && currentActiveSlot.weekMonday) {
      delete slotMeta.weeklySchedules[currentActiveSlot.weekMonday];
    }
    if (Object.keys(slotMeta.weeklySchedules || {}).length === 0) {
      delete state.customTimetableMeta[currentActiveSlot.slotKey];
    }
  }
  saveCustomTimetableMeta();
  closeModal('modal-timetable-detail');
  showToast('해당 주차 시간표 일정이 초기화되었습니다.');

  renderTimetable(state.selectedGrade, state.selectedClass);
}

// 4-2. 전자칠판 대화면 전용 실시간 일과 및 키오스크 모드 (2단계)
function getCurrentPeriodStatus(now = new Date()) {
  const day = now.getDay(); // 0: 일, 1: 월, ..., 6: 토
  if (day === 0 || day === 6) {
    return {
      isSchoolHours: false,
      statusType: 'weekend',
      currentPerio: null,
      label: '주말 휴일',
      desc: '행복하고 알찬 주말 보내세요! 🎈'
    };
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalM = hours * 60 + minutes;

  // 1교시: 08:40 ~ 09:30 (520 ~ 570)
  // 2교시: 09:40 ~ 10:30 (580 ~ 630)
  // 3교시: 10:40 ~ 11:30 (640 ~ 690)
  // 4교시: 11:40 ~ 12:30 (700 ~ 750)
  // 점심:  12:30 ~ 13:30 (750 ~ 810)
  // 5교시: 13:30 ~ 14:20 (810 ~ 860)
  // 6교시: 14:30 ~ 15:20 (870 ~ 920)
  // 7교시: 15:30 ~ 16:20 (930 ~ 980)
  // 종례:  16:20 ~ 17:00 (980 ~ 1020)

  if (totalM < 520) {
    return {
      isSchoolHours: true,
      statusType: 'morning',
      currentPerio: null,
      label: '등교 및 자습 시간',
      desc: '1교시 시작(08:40) 전 차분히 수업을 준비하는 시간입니다.'
    };
  } else if (totalM >= 520 && totalM < 570) {
    const remain = 570 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 1,
      label: '1교시 수업 진행 중',
      desc: `1교시 일과 진행 중입니다. (종료까지 약 ${remain}분)`
    };
  } else if (totalM >= 570 && totalM < 580) {
    return {
      isSchoolHours: true,
      statusType: 'break',
      currentPerio: null,
      label: '쉬는 시간 (1교시 종료)',
      desc: '2교시 시작(09:40) 전 교재를 챙기고 휴식을 취하세요.'
    };
  } else if (totalM >= 580 && totalM < 630) {
    const remain = 630 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 2,
      label: '2교시 수업 진행 중',
      desc: `2교시 일과 진행 중입니다. (종료까지 약 ${remain}분)`
    };
  } else if (totalM >= 630 && totalM < 640) {
    return {
      isSchoolHours: true,
      statusType: 'break',
      currentPerio: null,
      label: '쉬는 시간 (2교시 종료)',
      desc: '3교시 시작(10:40) 전 교재를 챙기고 휴식을 취하세요.'
    };
  } else if (totalM >= 640 && totalM < 690) {
    const remain = 690 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 3,
      label: '3교시 수업 진행 중',
      desc: `3교시 일과 진행 중입니다. (종료까지 약 ${remain}분)`
    };
  } else if (totalM >= 690 && totalM < 700) {
    return {
      isSchoolHours: true,
      statusType: 'break',
      currentPerio: null,
      label: '쉬는 시간 (3교시 종료)',
      desc: '4교시 시작(11:40) 전 교재를 챙기고 휴식을 취하세요.'
    };
  } else if (totalM >= 700 && totalM < 750) {
    const remain = 750 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 4,
      label: '4교시 수업 진행 중',
      desc: `4교시 일과 진행 중입니다. (종료 후 점심시간, 약 ${remain}분 남음)`
    };
  } else if (totalM >= 750 && totalM < 810) {
    const remain = 810 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'lunch',
      currentPerio: null,
      label: '즐거운 점심시간 🍽️',
      desc: `맛있는 점심 급식 시간입니다. (5교시 시작 13:30까지 약 ${remain}분)`
    };
  } else if (totalM >= 810 && totalM < 860) {
    const remain = 860 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 5,
      label: '5교시 수업 진행 중',
      desc: `5교시 일과 진행 중입니다. (종료까지 약 ${remain}분)`
    };
  } else if (totalM >= 860 && totalM < 870) {
    return {
      isSchoolHours: true,
      statusType: 'break',
      currentPerio: null,
      label: '쉬는 시간 (5교시 종료)',
      desc: '6교시 시작(14:30) 전 교재를 챙기고 휴식을 취하세요.'
    };
  } else if (totalM >= 870 && totalM < 920) {
    const remain = 920 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 6,
      label: '6교시 수업 진행 중',
      desc: `6교시 일과 진행 중입니다. (종료까지 약 ${remain}분)`
    };
  } else if (totalM >= 920 && totalM < 930) {
    return {
      isSchoolHours: true,
      statusType: 'break',
      currentPerio: null,
      label: '쉬는 시간 (6교시 종료)',
      desc: '마지막 7교시 시작(15:30) 전 휴식을 취하세요.'
    };
  } else if (totalM >= 930 && totalM < 980) {
    const remain = 980 - totalM;
    return {
      isSchoolHours: true,
      statusType: 'class',
      currentPerio: 7,
      label: '7교시 수업 진행 중',
      desc: `오늘 마지막 7교시 수업 중입니다. (종료까지 약 ${remain}분)`
    };
  } else if (totalM >= 980 && totalM < 1020) {
    return {
      isSchoolHours: true,
      statusType: 'cleaning',
      currentPerio: null,
      label: '종례 및 교실 청소 시간',
      desc: '선생님 종례 및 교실 환경정리 시간입니다.'
    };
  } else {
    return {
      isSchoolHours: false,
      statusType: 'afterschool',
      currentPerio: null,
      label: '방과후 및 하교 / 자율학습',
      desc: '오늘 정규 일과가 종료되었습니다. 수고 많으셨습니다! 🌟'
    };
  }
}

let realtimeClockTimer = null;

function updateRealtimeBoard() {
  const now = new Date();

  const boardClassEl = document.getElementById('live-board-class-name');
  if (boardClassEl) {
    const grade = state.selectedGrade || 1;
    const classNm = state.selectedClass || 1;
    boardClassEl.textContent = state.isSmartphone
      ? `${grade}학년 ${classNm}반 스마트 보드`
      : `${grade}학년 ${classNm}반 전자칠판 · 실시간 일과`;
  }

  const status = getCurrentPeriodStatus(now);
  const periodTextEl = document.getElementById('live-period-text');
  const periodDescEl = document.getElementById('live-period-desc');
  const periodBadgeEl = document.getElementById('live-period-badge');
  const headlineEl = document.getElementById('live-period-headline');

  // 오늘 시간표에서 교시별 과목/선생님 조회
  const todayPeriods = state.homeTodayPeriods || [];
  const findPeriod = (p) => todayPeriods.find(item => item.perio === p);
  const describePeriod = (p) => {
    const item = findPeriod(p);
    if (!item) return `${p}교시`;
    return `${p}교시 ${item.subject}${item.teacher ? ` (${item.teacher})` : ''}`;
  };

  // 다음 교시 계산 (교시 시작 시각 기준)
  const PERIOD_STARTS = { 1: 520, 2: 580, 3: 640, 4: 700, 5: 810, 6: 870, 7: 930 };
  const totalM = now.getHours() * 60 + now.getMinutes();
  let nextPerio = null;
  for (let p = 1; p <= 7; p++) {
    if (PERIOD_STARTS[p] > totalM) { nextPerio = p; break; }
  }
  const startStr = (p) => `${String(Math.floor(PERIOD_STARTS[p] / 60)).padStart(2, '0')}:${String(PERIOD_STARTS[p] % 60).padStart(2, '0')}`;

  let badgeLabel = status.label;
  let headline = status.desc;
  let desc = '';

  if (status.statusType === 'class' && status.currentPerio) {
    badgeLabel = `${status.currentPerio}교시 수업 중`;
    const item = findPeriod(status.currentPerio);
    headline = item ? `지금은 ${describePeriod(status.currentPerio)}` : status.label;
    desc = status.desc;
  } else if (status.statusType === 'break' || status.statusType === 'lunch' || status.statusType === 'morning') {
    badgeLabel = status.statusType === 'break' ? '쉬는 시간' : status.statusType === 'lunch' ? '점심시간 🍽️' : '등교 · 자습';
    if (nextPerio && todayPeriods.length) {
      headline = `다음 시간 ▶ ${describePeriod(nextPerio)}`;
      desc = `${startStr(nextPerio)} 시작 · ${findPeriod(nextPerio) && findPeriod(nextPerio).isFree ? '자율 시간입니다.' : '교과서와 준비물을 미리 챙겨주세요.'}`;
    } else {
      headline = status.desc;
    }
  } else {
    desc = '';
  }

  if (periodTextEl) periodTextEl.textContent = badgeLabel;
  if (headlineEl) headlineEl.textContent = headline;
  if (periodDescEl) periodDescEl.textContent = desc;

  if (periodBadgeEl) {
    const variant = status.statusType === 'class' ? 'live-badge-class'
      : status.statusType === 'lunch' ? 'live-badge-lunch'
      : (status.statusType === 'break' || status.statusType === 'morning') ? 'live-badge-break'
      : 'live-badge-idle';
    periodBadgeEl.className = `live-badge ${variant}`;
  }

  // 교시 변경 감지 시 홈 시간표 하이라이트 동기화
  if (state.lastTrackedPerio !== status.currentPerio) {
    state.lastTrackedPerio = status.currentPerio;
    highlightHomeActivePeriod(status.currentPerio);
  }

  // 자정(00:00) 자동 갱신 감지
  const todayDay = now.getDate();
  if (state.lastTrackedDay !== null && state.lastTrackedDay !== todayDay) {
    state.lastTrackedDay = todayDay;
    state.currentDate = new Date();
    state.timetableMonday = getMondayOfWeek(state.currentDate);
    const headerDate = document.getElementById('header-date');
    if (headerDate) headerDate.textContent = formatDateKorean(state.currentDate);
    syncHomeDashboardToToday();
    renderSchedule(state.scheduleYear, state.scheduleMonth);
  }
}

function highlightHomeActivePeriod(activePerio) {
  document.querySelectorAll('#home-timetable-list .timetable-slot-card').forEach(card => {
    const p = parseInt(card.dataset.perio, 10);
    const liveTag = card.querySelector('.now-period-pill');
    if (activePerio && p === activePerio) {
      card.classList.add('period-now-active');
      if (!liveTag) {
        const badgeArea = card.querySelector('.hp-right');
        if (badgeArea) {
          const pill = document.createElement('span');
          pill.className = 'now-period-pill px-2 py-1 rounded-md text-xs font-extrabold bg-[#1365C8] text-white flex items-center space-x-1 shrink-0 shadow-xs';
          pill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-300 live-pulse-dot"></span><span>NOW</span>';
          badgeArea.prepend(pill);
        }
      }
    } else {
      card.classList.remove('period-now-active');
      if (liveTag) liveTag.remove();
    }
  });
}

// ========================================================
// 4-2-B. 홈 대시보드 실시간 시간별 날씨 위젯 (금호고: 광주 북구 운암2동, 현재 ~ +3시간)
// ========================================================
let homeWeatherLastFetchTs = 0;
let homeWeatherCachedHourly = null;
let homeWeatherLastRenderedHour = -1;

function getWeatherWidgetSvgIcon(code, precipMm = 0, precipProb = 0) {
  if (code >= 95) {
    // 뇌우
    return `
      <svg viewBox="0 0 36 32" class="w-8 h-7 xl:w-9 xl:h-8 drop-shadow-2xs">
        <path d="M10 21h14.5a5 5 0 0 0 .6-9.97A7 7 0 0 0 11 9a5 5 0 0 0-1 12z" fill="#FFFFFF"/>
        <path d="M10 21h14.5a5 5 0 0 0 4.1-2.1H6.5A4.98 4.98 0 0 0 10 21z" fill="#DCE6F2"/>
        <polygon points="18,20 14,26 17.5,26 16,31 22,24.5 18.5,24.5" fill="#F5B935"/>
      </svg>
    `;
  } else if (code >= 80 || (code >= 51 && code <= 67) || precipMm >= 0.5 || precipProb >= 60) {
    // 비 / 소나기
    return `
      <svg viewBox="0 0 36 32" class="w-8 h-7 xl:w-9 xl:h-8 drop-shadow-2xs">
        <path d="M10 21h14.5a5 5 0 0 0 .6-9.97A7 7 0 0 0 11 9a5 5 0 0 0-1 12z" fill="#FFFFFF"/>
        <path d="M10 21h14.5a5 5 0 0 0 4.1-2.1H6.5A4.98 4.98 0 0 0 10 21z" fill="#DCE6F2"/>
        <line x1="13" y1="23.5" x2="11.5" y2="28" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round"/>
        <line x1="18.5" y1="23.5" x2="17" y2="28" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round"/>
        <line x1="24" y1="23.5" x2="22.5" y2="28" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  } else if (code >= 71 && code <= 77) {
    // 눈
    return `
      <svg viewBox="0 0 36 32" class="w-8 h-7 xl:w-9 xl:h-8 drop-shadow-2xs">
        <path d="M10 21h14.5a5 5 0 0 0 .6-9.97A7 7 0 0 0 11 9a5 5 0 0 0-1 12z" fill="#FFFFFF"/>
        <circle cx="13" cy="25.5" r="1.5" fill="#FFFFFF"/>
        <circle cx="18" cy="26.5" r="1.5" fill="#FFFFFF"/>
        <circle cx="23" cy="25.5" r="1.5" fill="#FFFFFF"/>
      </svg>
    `;
  } else if (code === 3 || code === 45 || code === 48) {
    // 흐림 / 구름많음 (구름 뒤 해 살짝 또는 구름)
    return `
      <svg viewBox="0 0 36 32" class="w-8 h-7 xl:w-9 xl:h-8 drop-shadow-2xs">
        <circle cx="22.5" cy="11.5" r="6.2" fill="#F5B935"/>
        <path d="M10.5 24h14.5a5.2 5.2 0 0 0 .6-10.37A7.2 7.2 0 0 0 11 11.5a5.2 5.2 0 0 0-.5 12.5z" fill="#FFFFFF"/>
        <path d="M10.5 24h14.5a5.2 5.2 0 0 0 4.3-2.2H6.8A5.18 5.18 0 0 0 10.5 24z" fill="#DCE6F2"/>
      </svg>
    `;
  } else if (code === 1 || code === 2) {
    // 구름조금 (레퍼런스 이미지의 구름+노란해 아이콘)
    return `
      <svg viewBox="0 0 36 32" class="w-8 h-7 xl:w-9 xl:h-8 drop-shadow-2xs">
        <circle cx="22.5" cy="11.5" r="6.5" fill="#F5B935"/>
        <path d="M10.5 24h14.5a5.2 5.2 0 0 0 .6-10.37A7.2 7.2 0 0 0 11 11.5a5.2 5.2 0 0 0-.5 12.5z" fill="#FFFFFF"/>
        <path d="M10.5 24h14.5a5.2 5.2 0 0 0 4.3-2.2H6.8A5.18 5.18 0 0 0 10.5 24z" fill="#DCE6F2"/>
      </svg>
    `;
  } else {
    // 맑음 (레퍼런스 이미지의 노란 원형 태양 아이콘)
    return `
      <svg viewBox="0 0 32 32" class="w-7 h-7 xl:w-8 xl:h-8 drop-shadow-2xs">
        <circle cx="16" cy="16" r="10" fill="#F5B935"/>
      </svg>
    `;
  }
}

function buildSmoothTempCurveSvg(temps) {
  const xs = [50, 150, 250, 350];
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT;

  const ys = temps.map(t => {
    if (range < 0.2) return 12;
    // 높은 기온일수록 위쪽(y=5), 낮은 기온일수록 아래쪽(y=19)
    return Math.round((18.5 - ((t - minT) / range) * 13) * 10) / 10;
  });

  // 4개 포인트를 잇는 부드러운 큐빅 베지어 곡선 + 우측 여백 자연스러운 연장선
  const d = [
    `M ${xs[0]} ${ys[0]}`,
    `C ${xs[0] + 45} ${ys[0]}, ${xs[1] - 45} ${ys[1]}, ${xs[1]} ${ys[1]}`,
    `C ${xs[1] + 45} ${ys[1]}, ${xs[2] - 45} ${ys[2]}, ${xs[2]} ${ys[2]}`,
    `C ${xs[2] + 45} ${ys[2]}, ${xs[3] - 45} ${ys[3]}, ${xs[3]} ${ys[3]}`
  ].join(' ');

  const dotsHtml = ys.map((y) => {
    const topPct = Math.round((y / 24) * 1000) / 10;
    return `
      <div class="hw-dot-col">
        <span class="hw-curve-dot" style="top: ${topPct}%;"></span>
      </div>
    `;
  }).join('');

  return `
    <div class="hw-curve-box">
      <svg viewBox="0 0 400 24" preserveAspectRatio="none" class="hw-curve-svg">
        <path d="${d}" fill="none" stroke="rgba(255, 255, 255, 0.88)" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="hw-grid-row hw-dots-grid">
        ${dotsHtml}
      </div>
    </div>
  `;
}

function renderHomeWeatherSlotsUI(slots, isLive = true) {
  const container = document.getElementById('home-weather-hourly');
  const labelEl = document.getElementById('home-weather-live-label');
  if (!container || !slots || slots.length === 0) return;

  if (labelEl) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    labelEl.textContent = isLive ? `실시간 ${hh}:${mm} 기준` : '예보 기준';
  }

  const temps = slots.map(s => s.temp);
  const curveSvg = buildSmoothTempCurveSvg(temps);

  const dropSvg = `
    <svg viewBox="0 0 12 14" class="w-2.5 h-3 shrink-0 fill-white/75">
      <path d="M6 1C6 1 1.5 6.2 1.5 9.2A4.5 4.5 0 0 0 10.5 9.2C10.5 6.2 6 1 6 1Z"/>
    </svg>
  `;

  container.innerHTML = `
    <!-- 1행: 시간 (현재 ~ +3시간) -->
    <div class="hw-grid-row">
      ${slots.map(s => `<div class="hw-time">${s.timeStr}</div>`).join('')}
    </div>
    <!-- 2행: 날씨 아이콘 -->
    <div class="hw-grid-row">
      ${slots.map(s => `<div class="hw-icon-wrap">${getWeatherWidgetSvgIcon(s.code, s.precipMm, s.precipProb)}</div>`).join('')}
    </div>
    <!-- 3행: 기온 -->
    <div class="hw-grid-row">
      ${slots.map(s => `<div class="hw-temp">${Math.round(s.temp)}°</div>`).join('')}
    </div>
    <!-- 4행: 기온 변화 추세선 -->
    ${curveSvg}
    <!-- 5행: 강수확률 -->
    <div class="hw-grid-row">
      ${slots.map(s => `<div class="hw-precip">${dropSvg}<span>${s.precipProb}%</span></div>`).join('')}
    </div>
  `;
}

async function renderHomeWeatherWidget(forceFetch = false) {
  const container = document.getElementById('home-weather-hourly');
  if (!container) return;

  const now = new Date();
  homeWeatherLastRenderedHour = now.getHours();

  // 1) 즉각적인 초기 렌더링을 위해 폴백 슬롯 4개(현재 ~ +3시간) 먼저 구성
  const fallbackSlots = [0, 1, 2, 3].map(offset => {
    const dt = new Date(now.getTime() + offset * 3600000);
    const h = dt.getHours();
    const m = dt.getMonth() + 1;
    const d = dt.getDate();
    const fb = generateFallbackWeather(m, d, h);
    return {
      timeStr: `${String(h).padStart(2, '0')}:00`,
      temp: fb.temp,
      precipMm: fb.precipMm,
      precipProb: fb.precipProb,
      code: fb.isRain ? 61 : (fb.statusText === '구름많음' ? 2 : 0)
    };
  });

  if (!homeWeatherCachedHourly) {
    renderHomeWeatherSlotsUI(fallbackSlots, false);
  }

  // 2) Open-Meteo 실시간 API 조회 (광주 북구 운암2동 금호고등학교: 35.1764, 126.8833)
  const shouldFetch = forceFetch || !homeWeatherCachedHourly || (Date.now() - homeWeatherLastFetchTs > 10 * 60 * 1000);
  if (shouldFetch) {
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=35.1764&longitude=126.8833&hourly=temperature_2m,precipitation_probability,precipitation,weathercode&timezone=Asia%2FSeoul&forecast_days=2';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.hourly && Array.isArray(data.hourly.time)) {
          homeWeatherCachedHourly = data.hourly;
          homeWeatherLastFetchTs = Date.now();
        }
      }
    } catch (err) {
      // 네트워크 오프라인 시 캐시 또는 폴백 유지
    }
  }

  if (homeWeatherCachedHourly) {
    const liveSlots = [0, 1, 2, 3].map((offset, idx) => {
      const dt = new Date(now.getTime() + offset * 3600000);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      const h = String(dt.getHours()).padStart(2, '0');
      const targetIsoPrefix = `${y}-${m}-${d}T${h}:00`;

      const timeIdx = homeWeatherCachedHourly.time.findIndex(t => t.startsWith(targetIsoPrefix.substring(0, 13)));
      if (timeIdx !== -1) {
        return {
          timeStr: `${h}:00`,
          temp: homeWeatherCachedHourly.temperature_2m[timeIdx],
          precipMm: homeWeatherCachedHourly.precipitation ? (homeWeatherCachedHourly.precipitation[timeIdx] || 0) : 0,
          precipProb: homeWeatherCachedHourly.precipitation_probability ? (homeWeatherCachedHourly.precipitation_probability[timeIdx] || 0) : 0,
          code: homeWeatherCachedHourly.weathercode ? (homeWeatherCachedHourly.weathercode[timeIdx] || 0) : 0
        };
      }
      return fallbackSlots[idx];
    });

    renderHomeWeatherSlotsUI(liveSlots, true);
  }
}

function initRealtimeClock() {
  if (realtimeClockTimer) clearInterval(realtimeClockTimer);
  state.lastTrackedDay = new Date().getDate();
  updateRealtimeBoard();
  renderHomeWeatherWidget(true);
  realtimeClockTimer = setInterval(() => {
    updateRealtimeBoard();
    const currentHour = new Date().getHours();
    if (currentHour !== homeWeatherLastRenderedHour || (Date.now() - homeWeatherLastFetchTs > 10 * 60 * 1000)) {
      renderHomeWeatherWidget();
    }
  }, 1000);
}

// 4-3. 전자칠판 풀스크린 / 키오스크 모드 및 화면 꺼짐 방지
let screenWakeLock = null;

async function requestScreenWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      screenWakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {}
}

function releaseScreenWakeLock() {
  try {
    if (screenWakeLock) {
      screenWakeLock.release();
      screenWakeLock = null;
    }
  } catch (err) {}
}

async function toggleKioskMode() {
  const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
  if (!isCurrentlyFullscreen) {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else {
        updateKioskUI(true);
      }
    } catch (err) {
      // Fullscreen failed or disallowed, toggle body class directly
      const nextState = !document.body.classList.contains('kiosk-mode');
      updateKioskUI(nextState);
    }
  } else {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
    } catch (err) {
      updateKioskUI(false);
    }
  }
}

function updateKioskUI(isKiosk) {
  state.isKiosk = isKiosk;
  const headerIcon = document.getElementById('header-fullscreen-icon');
  const kioskIcon = document.getElementById('kiosk-btn-icon');
  const kioskText = document.getElementById('kiosk-btn-text');

  if (isKiosk) {
    document.body.classList.add('kiosk-mode');
    if (headerIcon) headerIcon.setAttribute('data-lucide', 'minimize');
    if (kioskIcon) kioskIcon.setAttribute('data-lucide', 'minimize');
    if (kioskText) kioskText.textContent = '창 모드';
    requestScreenWakeLock();
    showToast('전자칠판 키오스크 모드가 활성화되었습니다.');
  } else {
    document.body.classList.remove('kiosk-mode');
    if (headerIcon) headerIcon.setAttribute('data-lucide', 'maximize');
    if (kioskIcon) kioskIcon.setAttribute('data-lucide', 'maximize');
    if (kioskText) kioskText.textContent = '전체화면';
    releaseScreenWakeLock();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function isSmartphoneDevice() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  // 명시적 스마트폰 및 모바일 인앱 브라우저 User-Agent 패턴 검사
  const isPhoneUA = /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|webOS|KAKAOTALK|NAVER|Instagram|FBAN|FBAV|DaumApps|Everytime|Line/i.test(ua);
  const isClientHintMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
  // 스마트폰 화면 규격(768px 이하) 감지 (전자칠판은 1024px~3840px 대화면 환경)
  const isSmallViewport = window.innerWidth <= 768;
  // URL 파라미터(?mobile=1)로 스마트폰 뷰 테스트 지원
  const urlParams = new URLSearchParams(window.location.search);
  const forceMobile = urlParams.get('mobile') === '1';

  return isPhoneUA || isClientHintMobile || isSmallViewport || forceMobile;
}

function detectAndApplySmartphoneMode() {
  const isPhone = isSmartphoneDevice();
  const prevIsPhone = state.isSmartphone;
  state.isSmartphone = isPhone;
  if (isPhone) {
    document.documentElement.classList.add('is-smartphone');
    if (document.body) document.body.classList.add('is-smartphone');
  } else {
    document.documentElement.classList.remove('is-smartphone');
    if (document.body) document.body.classList.remove('is-smartphone');
  }
  const mobileDayPanel = document.getElementById('timetable-mobile-day-panel');
  if (mobileDayPanel) {
    if (isPhone) {
      mobileDayPanel.classList.remove('hidden');
    } else {
      mobileDayPanel.classList.add('hidden');
    }
  }
  updateStudentBadge();
  if (prevIsPhone !== undefined && prevIsPhone !== isPhone && state.lastRenderedDaysData) {
    renderTimetable(state.selectedGrade, state.selectedClass);
  }
  return isPhone;
}

function updateStudentBadge() {
  const badge = document.getElementById('header-student-badge');
  const classText = document.getElementById('header-class-text');
  const boardClassEl = document.getElementById('live-board-class-name');
  if (!badge) return;
  const grade = state.selectedGrade || state.studentProfile.grade || 1;
  const classNm = state.selectedClass || state.studentProfile.classNm || 1;
  if (classText) {
    classText.textContent = state.isSmartphone
      ? `${grade}-${classNm} 학급보드`
      : `${grade}학년 ${classNm}반 학급보드`;
  }
  if (boardClassEl) {
    boardClassEl.textContent = state.isSmartphone
      ? `${grade}학년 ${classNm}반 스마트 보드`
      : `${grade}학년 ${classNm}반 전자칠판`;
  }
  badge.classList.remove('hidden');
}

function setDarkMode(isDark) {
  state.isDark = isDark;
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('kumho_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('kumho_theme', 'light');
  }
}

// 5. 학급 전광판 / 설정 모달 관리
function initSettingsModal() {
  const gradeInput = document.getElementById('settings-grade');
  const classInput = document.getElementById('settings-class');
  const grade2Notice = document.getElementById('settings-grade2-dev-notice');
  const saveBtn = document.getElementById('btn-save-settings');

  function updateGradeNoticeState() {
    const selectedVal = String(gradeInput?.value || '1');
    if (selectedVal === '2') {
      if (grade2Notice) grade2Notice.classList.remove('hidden');
      if (saveBtn) {
        saveBtn.textContent = '2학년 서비스 준비 중';
        saveBtn.classList.remove('bg-brand-600', 'hover:bg-brand-700');
        saveBtn.classList.add('bg-amber-500', 'hover:bg-amber-600');
      }
      showToast('🚧 2학년 서비스는 아직 개발 중입니다. 조금만 기다려 주세요!');
    } else {
      if (grade2Notice) grade2Notice.classList.add('hidden');
      if (saveBtn) {
        saveBtn.textContent = '학급 저장하기';
        saveBtn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
        saveBtn.classList.add('bg-brand-600', 'hover:bg-brand-700');
      }
    }
  }

  function syncSettingsInputs() {
    const curGrade = (state.selectedGrade === 1 || state.selectedGrade === 2) ? state.selectedGrade : 1;
    const curClass = (state.selectedClass >= 1 && state.selectedClass <= 9) ? state.selectedClass : 1;
    if (gradeInput) gradeInput.value = String(curGrade);
    if (classInput) classInput.value = String(curClass);
    if (grade2Notice) {
      if (String(curGrade) === '2') {
        grade2Notice.classList.remove('hidden');
      } else {
        grade2Notice.classList.add('hidden');
      }
    }
    if (saveBtn) {
      saveBtn.textContent = '학급 저장하기';
      saveBtn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
      saveBtn.classList.add('bg-brand-600', 'hover:bg-brand-700');
    }
  }

  gradeInput?.addEventListener('change', () => {
    updateGradeNoticeState();
  });

  document.getElementById('btn-settings-modal')?.addEventListener('click', () => {
    syncSettingsInputs();
    openModal('modal-settings');
  });

  document.getElementById('header-student-badge')?.addEventListener('click', () => {
    syncSettingsInputs();
    openModal('modal-settings');
  });

  document.getElementById('btn-timetable-change-class')?.addEventListener('click', () => {
    syncSettingsInputs();
    openModal('modal-settings');
  });

  document.getElementById('btn-close-settings-modal')?.addEventListener('click', () => {
    closeModal('modal-settings');
  });

  document.getElementById('btn-settings-open-allergens')?.addEventListener('click', () => {
    closeModal('modal-settings');
    openModal('modal-allergen');
  });

  document.getElementById('btn-save-settings')?.addEventListener('click', async () => {
    const grade = parseInt(gradeInput?.value || 1, 10);
    let classNm = parseInt(classInput?.value || 1, 10);
    if (classNm < 1 || classNm > 9) classNm = 1;

    // 2학년 선택 시 아직 개발 중 안내 문구 표시 및 적용 보류
    if (grade === 2) {
      if (grade2Notice) grade2Notice.classList.remove('hidden');
      showToast('🚧 2학년은 아직 개발 중이니 조금만 기다려 주세요!');
      return;
    }

    // 1학년 선택 후 확인(학급 저장하기) 클릭 시 기존처럼 그대로 적용
    state.studentProfile = { grade: 1, classNm };
    state.selectedGrade = 1;
    state.selectedClass = classNm;
    state.scheduleGradeFilter = '1';

    localStorage.setItem('kumho_student_profile', JSON.stringify(state.studentProfile));
    localStorage.setItem('kumho_my_grade', 1);
    localStorage.setItem('kumho_my_class', classNm);

    syncCurrentClassPrimaryDDay(1, classNm);
    updateStudentBadge();

    document.querySelectorAll('.grade-chip').forEach(c => {
      if (c.dataset.grade === '1') {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    closeModal('modal-settings');
    
    showToast(`1학년 ${classNm}반 학급보드로 설정되었습니다!`);

    // 주간 시간표가 다른 주차에 가 있더라도 홈 대시보드 오늘 시간표도 함께 갱신되도록 보장
    const savedMonday = state.timetableMonday ? new Date(state.timetableMonday) : null;
    const todayMonday = getMondayOfWeek(state.currentDate);
    if (savedMonday && formatDateYYYYMMDD(savedMonday) !== formatDateYYYYMMDD(todayMonday)) {
      state.timetableMonday = todayMonday;
      await renderTimetable(1, classNm, true);
      state.timetableMonday = savedMonday;
    }
    renderTimetable(1, classNm, true);
    renderSchedule(state.scheduleYear, state.scheduleMonth);
    setupMajorDDays();
  });
}

// 6. 알레르기 모달 초기화 및 관리
function initAllergenModal() {
  const container = document.getElementById('allergen-checkboxes-container');
  if (!container) return;

  container.innerHTML = Object.entries(ALLERGEN_DICT).map(([num, name]) => {
    const isChecked = state.userAllergens.includes(parseInt(num, 10));
    return `
      <label class="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition">
        <input type="checkbox" value="${num}" class="allergen-chk rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300 dark:border-slate-600" ${isChecked ? 'checked' : ''}>
        <span class="text-xs text-slate-700 dark:text-slate-200">
          <span class="font-bold text-slate-400 dark:text-slate-500 text-[10px] mr-1">${num}.</span>${name}
        </span>
      </label>
    `;
  }).join('');

  document.getElementById('btn-save-allergens')?.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.allergen-chk:checked');
    state.userAllergens = Array.from(checkboxes).map(cb => parseInt(cb.value, 10));
    localStorage.setItem('kumho_allergens', JSON.stringify(state.userAllergens));
    closeModal('modal-allergen');
    showToast('알레르기 설정이 저장되었습니다.');
    renderMealsForDate(state.mealDate);
  });

  document.getElementById('btn-reset-allergens')?.addEventListener('click', () => {
    document.querySelectorAll('.allergen-chk').forEach(cb => cb.checked = false);
    state.userAllergens = [];
    localStorage.removeItem('kumho_allergens');
    showToast('알레르기 설정이 초기화되었습니다.');
    renderMealsForDate(state.mealDate);
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// 7. 급식 파싱 및 알레르기 감지 로직
function parseMenuString(menuRaw) {
  if (!menuRaw) return [];
  const items = menuRaw.split(/<br\s*[\/]?>/gi);
  return items.map(item => {
    item = item.trim();
    if (!item) return null;

    const match = item.match(/\(([\d\.\s]+)\)/);
    let allergenNums = [];
    let cleanName = item;

    if (match) {
      allergenNums = match[1].split('.').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
      cleanName = item.replace(/\(([\d\.\s]+)\)/, '').trim();
    }

    const matchedUserAllergens = allergenNums.filter(n => state.userAllergens.includes(n));
    const hasAllergenWarning = matchedUserAllergens.length > 0;

    return {
      raw: item,
      cleanName,
      allergenNums,
      hasAllergenWarning,
      matchedUserAllergens
    };
  }).filter(Boolean);
}

// 8. NEIS 급식 API 연동
async function fetchMeal(ymd) {
  if (state.cache.meals[ymd]) {
    return state.cache.meals[ymd];
  }

  const url = `${CONFIG.API_BASE}/mealServiceDietInfo?Type=json&ATPT_OFCDC_SC_CODE=${CONFIG.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${CONFIG.SD_SCHUL_CODE}&MLSV_YMD=${ymd}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { lunch: null, dinner: null };
    }

    const data = await res.json();
    let lunch = null;
    let dinner = null;

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row) {
      const rows = data.mealServiceDietInfo[1].row;
      lunch = rows.find(r => r.MMEAL_SC_CODE === '2') || null;
      dinner = rows.find(r => r.MMEAL_SC_CODE === '3') || null;
    }

    const result = { lunch, dinner };
    state.cache.meals[ymd] = result;
    return result;
  } catch (err) {
    console.warn('Error fetching meal:', err);
    return { lunch: null, dinner: null };
  }
}

function updateHomeMealPreview(data, dateObj) {
  const homeDateStr = document.getElementById('home-meal-date-str');
  if (homeDateStr) homeDateStr.textContent = formatDateKorean(dateObj);

  const homeLunchDishes = document.getElementById('home-lunch-dishes');
  const homeDinnerDishes = document.getElementById('home-dinner-dishes');
  const homeLunchKcal = document.getElementById('home-lunch-kcal');
  const homeDinnerKcal = document.getElementById('home-dinner-kcal');

  const { lunch, dinner } = data;

  const emptyLi = (msg) => `<li class="col-span-2 row-span-full self-center text-center text-slate-400 font-semibold">${msg}</li>`;
  const dishLis = (dishes) => dishes.slice(0, 8).map(d => `
        <li class="${d.hasAllergenWarning ? 'text-amber-600 dark:text-amber-400' : ''}" title="${d.cleanName}">
          <span class="text-brand-400 dark:text-brand-500 mr-1">•</span>${d.cleanName}${d.hasAllergenWarning ? '<span class="text-[10px] align-middle bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded ml-1">주의</span>' : ''}
        </li>
      `).join('');

  if (!lunch && !dinner) {
    if (homeLunchDishes) homeLunchDishes.innerHTML = emptyLi('급식이 없는 날입니다.');
    if (homeDinnerDishes) homeDinnerDishes.innerHTML = emptyLi('급식이 없는 날입니다.');
    if (homeLunchKcal) homeLunchKcal.textContent = '-';
    if (homeDinnerKcal) homeDinnerKcal.textContent = '-';
    return;
  }

  if (lunch) {
    if (homeLunchKcal) homeLunchKcal.textContent = lunch.CAL_INFO || '';
    if (homeLunchDishes) homeLunchDishes.innerHTML = dishLis(parseMenuString(lunch.DDISH_NM));
  } else {
    if (homeLunchDishes) homeLunchDishes.innerHTML = emptyLi('중식이 없습니다.');
    if (homeLunchKcal) homeLunchKcal.textContent = '-';
  }

  if (dinner) {
    if (homeDinnerKcal) homeDinnerKcal.textContent = dinner.CAL_INFO || '';
    if (homeDinnerDishes) homeDinnerDishes.innerHTML = dishLis(parseMenuString(dinner.DDISH_NM));
  } else {
    if (homeDinnerDishes) homeDinnerDishes.innerHTML = emptyLi('석식이 없습니다.');
    if (homeDinnerKcal) homeDinnerKcal.textContent = '-';
  }
}

async function syncHomeDashboardToToday() {
  const now = new Date();
  state.currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. 헤더 날짜 업데이트
  const headerDate = document.getElementById('header-date');
  if (headerDate) headerDate.textContent = formatDateKorean(now);

  // 2. 홈 오늘 우리반 시간표 0ms 최우선 즉시 업데이트 (급식 네트워크 대기 없이 먼저 렌더링)
  state.timetableMonday = getMondayOfWeek(now);
  await renderTimetable(state.selectedGrade, state.selectedClass);

  // 3. 홈 오늘의 급식 비동기 업데이트 (타임아웃 보호 적용)
  const todayYmd = formatDateYYYYMMDD(now);
  const data = await fetchMeal(todayYmd);
  updateHomeMealPreview(data, now);
}

async function renderMealsForDate(dateObj) {
  const ymd = formatDateYYYYMMDD(dateObj);
  const inputElem = document.getElementById('meal-date-input');
  if (inputElem) inputElem.value = formatDateInput(dateObj);

  const mealDateStrEl = document.getElementById('meal-view-date-str');
  if (mealDateStrEl) mealDateStrEl.textContent = formatDateKorean(dateObj, false);

  const lunchListEl = document.getElementById('lunch-menu-list');
  const dinnerListEl = document.getElementById('dinner-menu-list');
  const lunchKcalEl = document.getElementById('lunch-cal-info');
  const dinnerKcalEl = document.getElementById('dinner-cal-info');
  const lunchNtrEl = document.getElementById('lunch-ntr-info');
  const dinnerNtrEl = document.getElementById('dinner-ntr-info');
  const noMealBox = document.getElementById('no-meal-box');
  const mealCards = document.getElementById('meal-cards-container');
  const alertBar = document.getElementById('meal-allergen-alert-bar');
  const alertText = document.getElementById('meal-allergen-detected-text');

  if (lunchListEl) lunchListEl.innerHTML = '<p class="text-xs text-slate-400 animate-pulse text-center py-6">식단 정보를 불러오는 중...</p>';
  if (dinnerListEl) dinnerListEl.innerHTML = '<p class="text-xs text-slate-400 animate-pulse text-center py-6">식단 정보를 불러오는 중...</p>';

  const data = await fetchMeal(ymd);
  const { lunch, dinner } = data;

  // 오늘 날짜인 경우에만 홈 대시보드 급식 프리뷰 동기화
  const isActualToday = (ymd === formatDateYYYYMMDD(new Date()));
  if (isActualToday) {
    updateHomeMealPreview(data, dateObj);
  }

  let detectedAllergensSummary = new Set();

  if (!lunch && !dinner) {
    if (noMealBox) noMealBox.classList.remove('hidden');
    if (mealCards) mealCards.classList.add('hidden');
    if (alertBar) alertBar.classList.add('hidden');
    return;
  }

  if (noMealBox) noMealBox.classList.add('hidden');
  if (mealCards) mealCards.classList.remove('hidden');

  // Helper to format nutrition string cleanly
  const formatNtrClean = (raw) => {
    if (!raw) return '영양 성분 정보 없음';
    return raw.replace(/<br\s*[\/]?>/gi, ' · ').replace(/\s+/g, ' ').trim();
  };

  if (lunch) {
    if (lunchKcalEl) lunchKcalEl.textContent = lunch.CAL_INFO || '';
    if (lunchNtrEl) lunchNtrEl.textContent = formatNtrClean(lunch.NTR_INFO);

    const dishes = parseMenuString(lunch.DDISH_NM);
    
    if (lunchListEl) {
      lunchListEl.innerHTML = dishes.map((d, idx) => {
        if (d.hasAllergenWarning) {
          d.matchedUserAllergens.forEach(num => detectedAllergensSummary.add(ALLERGEN_DICT[num]));
        }
        return `
          <div class="meal-dish-row ${d.hasAllergenWarning ? 'has-allergen-alert' : ''}">
            <div class="flex items-center space-x-2.5 min-w-0">
              <span class="mdr-num">${idx + 1}</span>
              <span class="mdr-name">${d.cleanName}</span>
              ${d.hasAllergenWarning ? `
                <span class="text-[10px] xl:text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full pulse-badge flex items-center space-x-1 shrink-0">
                  <i data-lucide="shield-alert" class="w-3 h-3"></i>
                  <span>주의 (${d.matchedUserAllergens.map(n => ALLERGEN_DICT[n]).join(', ')})</span>
                </span>
              ` : ''}
            </div>
            ${d.allergenNums.length ? `
              <span class="text-[11px] xl:text-xs text-slate-400 dark:text-slate-500 font-mono font-bold tracking-tight shrink-0 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md" title="${d.allergenNums.map(n => ALLERGEN_DICT[n] || n).join(', ')}">
                [${d.allergenNums.join('.')}]
              </span>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  } else {
    if (lunchListEl) {
      lunchListEl.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-2 rounded-2xl bg-slate-50/70 dark:bg-slate-700/20 border border-dashed border-slate-200 dark:border-slate-700">
          <span class="text-3xl">☕</span>
          <h4 class="text-base font-bold text-slate-700 dark:text-slate-200">중식이 제공되지 않는 날입니다</h4>
          <p class="text-xs text-slate-400">학사일정에 따른 미급식일입니다.</p>
        </div>
      `;
    }
    if (lunchKcalEl) lunchKcalEl.textContent = '-';
    if (lunchNtrEl) lunchNtrEl.textContent = '제공 정보 없음';
  }

  if (dinner) {
    if (dinnerKcalEl) dinnerKcalEl.textContent = dinner.CAL_INFO || '';
    if (dinnerNtrEl) dinnerNtrEl.textContent = formatNtrClean(dinner.NTR_INFO);

    const dishes = parseMenuString(dinner.DDISH_NM);
    
    if (dinnerListEl) {
      dinnerListEl.innerHTML = dishes.map((d, idx) => {
        if (d.hasAllergenWarning) {
          d.matchedUserAllergens.forEach(num => detectedAllergensSummary.add(ALLERGEN_DICT[num]));
        }
        return `
          <div class="meal-dish-row ${d.hasAllergenWarning ? 'has-allergen-alert' : ''}">
            <div class="flex items-center space-x-2.5 min-w-0">
              <span class="mdr-num">${idx + 1}</span>
              <span class="mdr-name">${d.cleanName}</span>
              ${d.hasAllergenWarning ? `
                <span class="text-[10px] xl:text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full pulse-badge flex items-center space-x-1 shrink-0">
                  <i data-lucide="shield-alert" class="w-3 h-3"></i>
                  <span>주의 (${d.matchedUserAllergens.map(n => ALLERGEN_DICT[n]).join(', ')})</span>
                </span>
              ` : ''}
            </div>
            ${d.allergenNums.length ? `
              <span class="text-[11px] xl:text-xs text-slate-400 dark:text-slate-500 font-mono font-bold tracking-tight shrink-0 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md" title="${d.allergenNums.map(n => ALLERGEN_DICT[n] || n).join(', ')}">
                [${d.allergenNums.join('.')}]
              </span>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  } else {
    if (dinnerListEl) {
      dinnerListEl.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center p-6 text-center space-y-3 rounded-2xl bg-slate-50/70 dark:bg-slate-700/20 border border-dashed border-slate-200 dark:border-slate-700">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center">
            <i data-lucide="moon" class="w-6 h-6"></i>
          </div>
          <div>
            <h4 class="text-base xl:text-lg font-black text-slate-800 dark:text-slate-200">석식이 운영되지 않는 날입니다</h4>
            <p class="text-xs xl:text-sm text-slate-400 dark:text-slate-500 mt-1">방과 후 일정 및 안전한 귀가를 응원합니다 ✨</p>
          </div>
        </div>
      `;
    }
    if (dinnerKcalEl) dinnerKcalEl.textContent = '-';
    if (dinnerNtrEl) dinnerNtrEl.textContent = '제공 정보 없음';
  }

  if (alertBar && alertText) {
    if (detectedAllergensSummary.size > 0) {
      alertBar.classList.remove('hidden');
      alertText.textContent = `주의: [${Array.from(detectedAllergensSummary).join(', ')}] 식품 포함`;
    } else {
      alertBar.classList.add('hidden');
    }
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// 9. 학사일정 데이터 로드 (금호고 공식 홈페이지 학사일정 마스터 우선 + 중복 완전 제거)
async function fetchMonthlySchedule(year, month) {
  const cacheKey = `${year}-${String(month).padStart(2, '0')}`;
  if (state.cache.schedules[cacheKey]) {
    return state.cache.schedules[cacheKey];
  }

  const prefix = `${year}${String(month).padStart(2, '0')}`;
  
  // 1) 금호고 공식 마스터 일정에서 해당 월의 일정 추출 (학교 공식 홈페이지 기준)
  const officialMonthlyEvents = KUMHO_OFFICIAL_SCHEDULE.filter(item => item.AA_YMD.startsWith(prefix));

  // 학교 공식 학사일정에 해당 월의 데이터가 이미 100% 등록되어 있으면 중복 외부 호출 없이 즉시 반환 (0ms)
  if (officialMonthlyEvents.length > 0) {
    const finalRows = [...officialMonthlyEvents].sort((a, b) => a.AA_YMD.localeCompare(b.AA_YMD));
    state.cache.schedules[cacheKey] = finalRows;
    return finalRows;
  }

  // 2) 공식 마스터 일정에 없는 월(차기 학년도 등)만 NEIS 오픈 API 보조 조회
  const lastDay = new Date(year, month, 0).getDate();
  const fromYMD = `${prefix}01`;
  const toYMD = `${prefix}${String(lastDay).padStart(2, '0')}`;
  const url = `${CONFIG.API_BASE}/SchoolSchedule?Type=json&ATPT_OFCDC_SC_CODE=${CONFIG.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${CONFIG.SD_SCHUL_CODE}&AA_FROM_YMD=${fromYMD}&AA_TO_YMD=${toYMD}`;

  let neisRows = [];
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.SchoolSchedule && data.SchoolSchedule[1]?.row) {
      neisRows = data.SchoolSchedule[1].row.filter(r => !r.EVENT_NM.includes('토요휴업일'));
    }
  } catch (err) {
    console.warn('NEIS schedule fetch skipped:', err);
  }

  state.cache.schedules[cacheKey] = neisRows;
  return neisRows;
}

// D-Day 계산
function calculateDDay(targetYMD) {
  const target = parseYMDString(targetYMD);
  const now = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), state.currentDate.getDate());
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// D-Day 계산 대상 주요 일정 추출 (정기시험은 첫 날을 기준으로 하고 나머지 일수 디데이는 삭제)
function getMajorEventsForDDay(grade, fromYMD = formatDateYYYYMMDD(state.currentDate)) {
  const examKeywords = ['정기시험', '지필평가', '학력평가', '모의평가', '수능', '방학', '체육한마당', '축제', '수행평가', '졸업식'];

  // 1) 공식 일정 마스터에서 기준일(오늘) 이후 해당 학년 일정 필터링
  let events = KUMHO_OFFICIAL_SCHEDULE.filter(r => {
    if (r.AA_YMD < fromYMD) return false;
    const isKeyword = examKeywords.some(k => r.EVENT_NM.includes(k));
    if (!isKeyword) return false;

    if (grade === 1) return r.ONE_GRADE_EVENT_YN === 'Y';
    if (grade === 2) return r.TW_GRADE_EVENT_YN === 'Y';
    if (grade === 3) return r.THREE_GRADE_EVENT_YN === 'Y';
    return true;
  }).sort((a, b) => a.AA_YMD.localeCompare(b.AA_YMD));

  // 2) 정기시험은 맨 첫 날만 남기고 나머지 일수 디데이는 삭제
  const seenExams = new Set();
  const dedupedEvents = [];

  for (const ev of events) {
    if (ev.EVENT_NM.includes('정기시험') || ev.EVENT_NM.includes('지필평가')) {
      let sessionKey = '';
      if ((ev.EVENT_NM.includes('1학기') && ev.EVENT_NM.includes('1차')) || ev.AA_YMD.startsWith('202604')) {
        sessionKey = '1학기_1차';
      } else if ((ev.EVENT_NM.includes('1학기') && ev.EVENT_NM.includes('2차')) || ev.AA_YMD.startsWith('202606') || ev.AA_YMD.startsWith('202607')) {
        sessionKey = '1학기_2차';
      } else if (ev.AA_YMD.startsWith('202609') || ev.AA_YMD.startsWith('202610')) {
        sessionKey = '2학기_1차';
      } else if (ev.AA_YMD.startsWith('202612')) {
        sessionKey = '2학기_2차';
      } else {
        sessionKey = ev.EVENT_NM;
      }

      if (seenExams.has(sessionKey)) {
        // 이미 해당 정기시험의 첫 날이 등록되었으므로 후속 일수는 D-Day 대상에서 삭제
        continue;
      }
      seenExams.add(sessionKey);

      let cleanTitle = ev.EVENT_NM;
      if (sessionKey === '2학기_1차') {
        cleanTitle = '2학기 중간고사 (1차 정기시험)';
      } else if (sessionKey === '2학기_2차') {
        cleanTitle = '2학기 기말고사 (2차 정기시험)';
      } else if (sessionKey === '1학기_1차') {
        cleanTitle = '1학기 중간고사 (1차 정기시험)';
      } else if (sessionKey === '1학기_2차') {
        cleanTitle = '1학기 기말고사 (2차 정기시험)';
      }

      dedupedEvents.push({
        ...ev,
        DISPLAY_NM: cleanTitle
      });
    } else {
      dedupedEvents.push({
        ...ev,
        DISPLAY_NM: ev.EVENT_NM
      });
    }
  }

  return dedupedEvents;
}

// 학사일정 이벤트 분류 및 색상 맵핑 함수
function getEventCategory(item, gradeFilter) {
  const gFilter = gradeFilter !== undefined ? gradeFilter : (state ? (state.scheduleGradeFilter || state.selectedGrade || state.grade || 'all') : 'all');
  const name = item.EVENT_NM || '';
  const cntnt = item.EVENT_CNTNT || '';
  
  // 고등학교 3학년에 한정하여, 수능날은 공휴일이 아니라 시험일이므로 시험 일정과 같은 취급!
  const isSuneung = name.includes('수능') || name.includes('대학수학능력시험') || cntnt.includes('대학수학능력시험');
  if (isSuneung) {
    const isGrade3Context = (String(gFilter) === '3' || (String(gFilter) === 'all' && parseInt(state.grade, 10) === 3));
    if (isGrade3Context) {
      return {
        type: 'exam',
        label: '수능/시험',
        squareColor: 'bg-amber-500',
        badgeClass: 'bg-amber-500 text-white',
        borderClass: 'border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/20',
        pillClass: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
      };
    } else {
      // 1, 2학년에게는 수능날이 재량휴업일
      return {
        type: 'holiday',
        label: '재량휴업일',
        squareColor: 'bg-rose-500',
        badgeClass: 'bg-rose-500 text-white',
        borderClass: 'border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20',
        pillClass: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200'
      };
    }
  }

  const isHoliday = item.SBTR_DD_SC_NM === '휴업일' || 
    name.includes('휴업') || name.includes('공휴일') || name.includes('개천절') || 
    name.includes('한글날') || name.includes('삼일절') || name.includes('광복절') || 
    name.includes('현충일') || name.includes('어린이날') || name.includes('부처님') || 
    name.includes('추석') || name.includes('설날') || name.includes('성탄절') || name.includes('신정');
  
  if (isHoliday) {
    return {
      type: 'holiday',
      label: '휴업/공휴일',
      squareColor: 'bg-rose-500',
      badgeClass: 'bg-rose-500 text-white',
      borderClass: 'border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20',
      pillClass: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200'
    };
  }

  const isExam = name.includes('지필') || name.includes('시험') || name.includes('평가') || 
    name.includes('모평') || name.includes('모의') || name.includes('수능') || name.includes('듣기평가');
  if (isExam) {
    return {
      type: 'exam',
      label: '시험/평가',
      squareColor: 'bg-amber-500',
      badgeClass: 'bg-amber-500 text-white',
      borderClass: 'border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/20',
      pillClass: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
    };
  }

  const isFestival = name.includes('축제') || name.includes('한마당') || name.includes('캠프') || 
    name.includes('방학') || name.includes('졸업') || name.includes('입학') || name.includes('수련') || 
    name.includes('수학여행') || name.includes('플리마켓') || name.includes('대청소') || name.includes('체육') ||
    name.includes('콘서트') || name.includes('여행');
  if (isFestival) {
    return {
      type: 'festival',
      label: '행사/축제/방학',
      squareColor: 'bg-indigo-600',
      badgeClass: 'bg-indigo-600 text-white',
      borderClass: 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20',
      pillClass: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    };
  }

  // 기본값: 진로/학사/기타
  return {
    type: 'academic',
    label: '진로/학사',
    squareColor: 'bg-brand-600',
    badgeClass: 'bg-brand-600 text-white',
    borderClass: 'border-brand-300 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/20',
    pillClass: 'bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200'
  };
}

// 공휴일, 재량휴업일, 대체공휴일 판별 함수 (선택된 학년 적용 여부 엄격 판별)
function isHolidayDate(dateObj, eventsOnDay, gradeFilter) {
  const gFilter = gradeFilter !== undefined ? String(gradeFilter) : (state ? String(state.scheduleGradeFilter || state.selectedGrade || state.grade || 'all') : 'all');

  return (eventsOnDay || []).some(ev => {
    // 1) 해당 학년에 적용되는 일정인지 확인
    if (gFilter === '1' && ev.ONE_GRADE_EVENT_YN === 'N') return false;
    if (gFilter === '2' && ev.TW_GRADE_EVENT_YN === 'N') return false;
    if (gFilter === '3' && ev.THREE_GRADE_EVENT_YN === 'N') return false;

    // 2) 카테고리 확인 (3학년의 경우 수능은 정규 시험이므로 휴업일 아님)
    const cat = getEventCategory(ev, gFilter);
    return cat.type === 'holiday';
  });
}

// 달력 날짜 글자색 결정 함수 (토요일: 파란색, 일요일/공휴일/재량휴업일/대체공휴일: 빨간색, 학년에 맞게 공휴일이 아닌 날: 검은색 텍스트)
function getDateColorClass(dateObj, eventsOnDay, gradeFilter) {
  const dayOfWeek = dateObj.getDay(); // 0: 일, 6: 토
  const isHoliday = isHolidayDate(dateObj, eventsOnDay, gradeFilter);

  // 일요일이거나 국가공휴일, 학교재량휴업일, 대체공휴일은 빨간색
  if (dayOfWeek === 0 || isHoliday) {
    return 'text-rose-600 dark:text-rose-400 font-bold';
  }

  // 토요일은 파란색
  if (dayOfWeek === 6) {
    return 'text-blue-600 dark:text-blue-400 font-bold';
  }

  // 학년에 맞게 공휴일이 아닌 날은 검은색 텍스트
  return 'text-black dark:text-white font-bold';
}

// 월간 인터랙티브 달력 렌더링 (전자칠판 대화면 전용 텍스트 캡슐 배지)
function renderScheduleCalendar(year, month, filteredRows, allRows) {
  const grid = document.getElementById('schedule-calendar-grid');
  if (!grid) return;

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0: 일요일 ~ 6: 토요일
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  let html = '';

  // 1) 이전 달 오버플로 빈 셀
  for (let i = 0; i < firstDayIndex; i++) {
    const dayNum = prevMonthLastDay - firstDayIndex + 1 + i;
    html += `
      <div class="calendar-day-cell empty-cell opacity-25 cursor-default">
        <span class="day-number-text text-xs xl:text-sm text-slate-400 dark:text-slate-600 font-bold">${dayNum}</span>
      </div>
    `;
  }

  // 2) 당월 일자 셀
  for (let d = 1; d <= daysInMonth; d++) {
    const ymd = `${year}${String(month).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month - 1, d);
    const dayEvents = filteredRows.filter(r => r.AA_YMD === ymd);
    const allDayEvents = allRows.filter(r => r.AA_YMD === ymd);

    const isToday = formatDateYYYYMMDD(state.currentDate) === ymd;
    const isSelected = state.scheduleSelectedYmd === ymd;
    const colorClass = getDateColorClass(dateObj, allDayEvents, state.scheduleGradeFilter);

    html += `
      <div class="calendar-day-cell ${isToday ? 'today-cell ring-2 ring-brand-500/80' : ''} ${isSelected ? 'selected-day' : ''} cursor-pointer" data-ymd="${ymd}" title="${formatDateKorean(dateObj, false)} (클릭하여 상세 일정 보기)">
        <div class="w-full flex items-center justify-between">
          <span class="day-number-text text-xs xl:text-base font-black ${colorClass}">${d}</span>
          ${isToday ? '<span class="text-[9px] xl:text-[10px] font-black px-1.5 py-0.2 rounded-full bg-brand-600 text-white shrink-0">오늘</span>' : ''}
        </div>
        
        <!-- 일정 표시: 전자칠판 대화면용 선명한 이벤트 텍스트 캡슐 배지 -->
        <div class="w-full flex-1 flex flex-col justify-start gap-1 mt-1 overflow-hidden min-h-0">
          ${dayEvents.slice(0, 2).map(ev => {
            let badgeBg = 'bg-brand-600 text-white';
            let icon = '🏫';
            const cat = getEventCategory(ev, state.scheduleGradeFilter);
            if (cat.type === 'exam') {
              badgeBg = 'bg-amber-500 text-white';
              icon = '📝';
            } else if (cat.type === 'holiday') {
              badgeBg = 'bg-rose-500 text-white';
              icon = '🔴';
              if (ev.EVENT_NM.includes('삼일') || ev.EVENT_NM.includes('광복') || ev.EVENT_NM.includes('개천') || ev.EVENT_NM.includes('한글')) {
                icon = '🇰🇷';
              }
            } else if (cat.type === 'festival') {
              badgeBg = 'bg-indigo-600 text-white';
              icon = '🎉';
            }

            const shortTitle = ev.EVENT_NM.length > 8 ? ev.EVENT_NM.slice(0, 7) + '…' : ev.EVENT_NM;
            return `
              <div class="cal-event-badge ${badgeBg}" title="${ev.EVENT_NM}">
                <span>${icon} ${shortTitle}</span>
              </div>
            `;
          }).join('')}
          ${dayEvents.length > 2 ? `
            <span class="text-[9px] xl:text-[10px] text-slate-500 dark:text-slate-400 font-extrabold px-1 truncate">+${dayEvents.length - 2}개 더보기</span>
          ` : ''}
        </div>
      </div>
    `;
  }

  // 3) 다음 달 오버플로 빈 셀 (총 7의 배수로 그리드 마감)
  const totalCells = firstDayIndex + daysInMonth;
  const nextDays = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= nextDays; i++) {
    html += `
      <div class="calendar-day-cell empty-cell opacity-25 cursor-default">
        <span class="day-number-text text-xs xl:text-sm text-slate-400 dark:text-slate-600 font-bold">${i}</span>
      </div>
    `;
  }

  grid.innerHTML = html;

  // 일자 클릭 이벤트 등록
  grid.querySelectorAll('.calendar-day-cell[data-ymd]').forEach(cell => {
    cell.addEventListener('click', () => {
      const ymd = cell.dataset.ymd;
      state.scheduleSelectedYmd = ymd;

      grid.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected-day'));
      cell.classList.add('selected-day');

      renderScheduleDayDetail(ymd, filteredRows, allRows);
    });
  });
}

// 선택한 일자의 상세 일정 렌더링
function renderScheduleDayDetail(ymd, filteredRows, allRows) {
  const container = document.getElementById('schedule-selected-day-list');
  const titleEl = document.getElementById('sched-selected-day-title');
  const countEl = document.getElementById('sched-selected-day-count');
  if (!container || !ymd) return;

  const dateObj = parseYMDString(ymd);
  const dateKorean = formatDateKorean(dateObj);
  const isToday = formatDateYYYYMMDD(state.currentDate) === ymd;
  const dayEvents = filteredRows.filter(r => r.AA_YMD === ymd);
  const allDayEvents = allRows.filter(r => r.AA_YMD === ymd);
  const isHoliday = isHolidayDate(dateObj, allDayEvents, state.scheduleGradeFilter);

  if (titleEl) {
    titleEl.innerHTML = `
      <span>${dateKorean}</span>
      ${isToday ? '<span class="text-[10px] xl:text-xs font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white ml-1">오늘</span>' : ''}
      ${isHoliday ? '<span class="text-[10px] xl:text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white ml-1">휴업/공휴일</span>' : ''}
    `;
  }

  if (countEl) {
    countEl.textContent = `${dayEvents.length}개 일정`;
  }

  if (dayEvents.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/60">
        <div class="w-10 h-10 mx-auto mb-2 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
          <i data-lucide="calendar-check" class="w-5 h-5"></i>
        </div>
        <p class="text-sm font-bold text-slate-700 dark:text-slate-200">${dateKorean}에는 특별한 학사일정이 없습니다.</p>
        <p class="text-xs text-slate-400 mt-1">정규 일과 및 수업이 정상 운영됩니다. 📖</p>
      </div>
    `;
  } else {
    container.innerHTML = dayEvents.map(item => {
      const cat = getEventCategory(item, state.scheduleGradeFilter);
      const targetGrades = [];
      if (item.ONE_GRADE_EVENT_YN === 'Y') targetGrades.push('1');
      if (item.TW_GRADE_EVENT_YN === 'Y') targetGrades.push('2');
      if (item.THREE_GRADE_EVENT_YN === 'Y') targetGrades.push('3');
      const gradeText = targetGrades.length === 3 ? '전학년' : targetGrades.length ? `${targetGrades.join(',')}학년` : '공통';
      const isItemHoliday = item.SBTR_DD_SC_NM === '휴업일' && cat.type === 'holiday';

      return `
        <div class="flex items-center space-x-3 p-3 xl:p-3.5 rounded-2xl border ${cat.borderClass} bg-white dark:bg-slate-800/80 shadow-xs transition">
          <!-- 카테고리 배지 -->
          <div class="flex flex-col items-center justify-center w-11 h-11 xl:w-12 xl:h-12 rounded-xl ${cat.badgeClass} shrink-0 font-black leading-tight shadow-xs">
            <span class="text-xs xl:text-sm">${cat.label.slice(0, 2)}</span>
            <span class="text-[10px] xl:text-[11px] opacity-90">${dateObj.getDate()}일</span>
          </div>

          <!-- 행사 내용 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-1.5 mb-0.5 flex-wrap gap-y-1">
              <span class="text-xs xl:text-sm font-black text-slate-900 dark:text-white truncate">${item.EVENT_NM}</span>
              <span class="text-[10px] xl:text-[11px] font-bold px-2 py-0.5 rounded-full ${cat.pillClass}">${gradeText}</span>
              ${isItemHoliday ? '<span class="text-[10px] xl:text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">휴업일</span>' : ''}
            </div>
            ${item.EVENT_CNTNT ? `<p class="text-xs text-slate-500 dark:text-slate-400 truncate">${item.EVENT_CNTNT}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// 9. 학사일정 전체 렌더링 (달력 + 일자별 상세 + 전체 목록 + 홈 프리뷰)
async function renderSchedule(year, month) {
  const monthLabel = document.getElementById('sched-current-month-label');
  const listTitle = document.getElementById('sched-list-title');
  const itemCountEl = document.getElementById('sched-item-count');
  const container = document.getElementById('schedule-list-container');
  const homeSchedList = document.getElementById('home-schedule-list');

  if (monthLabel) monthLabel.textContent = `${year}년 ${month}월`;
  if (listTitle) listTitle.textContent = `${year}년 ${month}월 학사일정 전체`;
  if (container) container.innerHTML = '<p class="text-xs text-slate-400 animate-pulse">학사일정을 불러오는 중...</p>';

  const rawRows = await fetchMonthlySchedule(year, month);

  // 학년 필터링 (선택한 학년의 행사만 표시)
  const filteredRows = rawRows.filter(item => {
    if (state.scheduleGradeFilter === 'all') return true;
    if (state.scheduleGradeFilter === '1') return item.ONE_GRADE_EVENT_YN === 'Y';
    if (state.scheduleGradeFilter === '2') return item.TW_GRADE_EVENT_YN === 'Y';
    if (state.scheduleGradeFilter === '3') return item.THREE_GRADE_EVENT_YN === 'Y';
    return false;
  });

  if (itemCountEl) itemCountEl.textContent = `총 ${filteredRows.length}개`;

  // 선택된 일자 유효성 검사 (당월에 속하지 않으면 오늘 날짜 또는 1일로 설정)
  const currentMonthPrefix = `${year}${String(month).padStart(2, '0')}`;
  if (!state.scheduleSelectedYmd || !state.scheduleSelectedYmd.startsWith(currentMonthPrefix)) {
    const todayYmd = formatDateYYYYMMDD(state.currentDate);
    if (todayYmd.startsWith(currentMonthPrefix)) {
      state.scheduleSelectedYmd = todayYmd;
    } else {
      state.scheduleSelectedYmd = `${currentMonthPrefix}01`;
    }
  }

  // 1) 월간 인터랙티브 달력 렌더링
  renderScheduleCalendar(year, month, filteredRows, rawRows);

  // 2) 선택된 날짜 상세 일정 렌더링 (달력 밑)
  renderScheduleDayDetail(state.scheduleSelectedYmd, filteredRows, rawRows);

  // 3) 이달의 전체 학사일정 목록 렌더링
  if (container) {
    if (filteredRows.length === 0) {
      container.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">선택하신 학년에 해당하는 학사일정이 없습니다.</p>';
    } else {
      container.innerHTML = filteredRows.map(item => {
        const itemDate = parseYMDString(item.AA_YMD);
        const dayNum = itemDate.getDate();
        const dayStr = WEEKDAYS[itemDate.getDay()];
        const cat = getEventCategory(item, state.scheduleGradeFilter);

        const targetGrades = [];
        if (item.ONE_GRADE_EVENT_YN === 'Y') targetGrades.push('1');
        if (item.TW_GRADE_EVENT_YN === 'Y') targetGrades.push('2');
        if (item.THREE_GRADE_EVENT_YN === 'Y') targetGrades.push('3');
        const gradeText = targetGrades.length === 3 ? '전학년' : targetGrades.length ? `${targetGrades.join(',')}학년` : '공통';
        const isHoliday = item.SBTR_DD_SC_NM === '휴업일' && cat.type === 'holiday';

        const dayColorClass = getDateColorClass(itemDate, [item], state.scheduleGradeFilter);

        return `
          <div class="flex items-center space-x-3 p-2.5 xl:p-3 rounded-2xl border ${cat.borderClass} bg-white dark:bg-slate-800/80 shadow-xs transition">
            <!-- 날짜 배지 -->
            <div class="flex flex-col items-center justify-center w-11 h-11 xl:w-12 xl:h-12 rounded-xl ${cat.badgeClass} shrink-0 font-black leading-tight shadow-xs">
              <span class="text-sm xl:text-base">${dayNum}</span>
              <span class="text-[10px] xl:text-[11px] opacity-90">${dayStr}</span>
            </div>

            <!-- 행사 내용 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-1.5 mb-0.5 flex-wrap gap-y-1">
                <span class="text-xs xl:text-sm font-black text-slate-900 dark:text-white truncate">${item.EVENT_NM}</span>
                <span class="text-[10px] xl:text-[11px] font-bold px-2 py-0.5 rounded-full ${cat.pillClass}">${gradeText}</span>
                ${isHoliday ? '<span class="text-[10px] xl:text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">휴업일</span>' : ''}
              </div>
              ${item.EVENT_CNTNT ? `<p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${item.EVENT_CNTNT}</p>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 4) 홈 탭 스케줄 프리뷰 (오늘 이후 가장 가까운 본인 학년 주요 일정 3개, 지필평가는 첫 날 기준)
  if (homeSchedList) {
    const myGrade = state.selectedGrade;
    const upcoming = getMajorEventsForDDay(myGrade).slice(0, 3);

    if (upcoming.length === 0) {
      homeSchedList.innerHTML = '<p class="flex-1 flex items-center justify-center text-sm text-slate-400">예정된 주요 일정이 없습니다.</p>';
    } else {
      homeSchedList.innerHTML = upcoming.map(item => {
        const itemDate = parseYMDString(item.AA_YMD);
        const dday = calculateDDay(item.AA_YMD);
        const ddayBadge = dday === 0 ? 'D-Day' : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
        const title = item.DISPLAY_NM || item.EVENT_NM;

        return `
          <div class="home-sched-item">
            <div class="flex items-center space-x-3 min-w-0">
              <div class="flex flex-col items-center justify-center w-10 h-10 xl:w-11 xl:h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shrink-0 leading-none">
                <span class="text-[9px] xl:text-[10px] font-bold text-slate-400">${itemDate.getMonth()+1}월</span>
                <span class="text-sm xl:text-base font-black text-brand-700 dark:text-brand-300 mt-0.5">${itemDate.getDate()}</span>
              </div>
              <span class="truncate text-xs xl:text-sm text-slate-800 dark:text-slate-100 font-bold">${title}</span>
            </div>
            <span class="text-[11px] xl:text-xs font-black px-2.5 py-1 rounded-lg ${dday <= 7 ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'} shrink-0">${ddayBadge}</span>
          </div>
        `;
      }).join('');
    }
  }

  // 5) 주요 D-Day 카드 및 상단 배너 계산 (지필평가는 첫 날 기준)
  setupMajorDDays();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function setupMajorDDays() {
  const ddayGrid = document.getElementById('schedule-dday-cards');
  const bannerTitle = document.getElementById('banner-dday-title');
  const bannerCount = document.getElementById('banner-dday-count');
  const bannerDate = document.getElementById('banner-dday-date');
  const bannerSub = document.getElementById('banner-dday-sub');

  const myGrade = state.selectedGrade || 1;
  const myClass = state.selectedClass || 1;
  const classDDay = syncCurrentClassPrimaryDDay(myGrade, myClass);
  const majorEvents = getMajorEventsForDDay(myGrade);

  // 상단 배너 설정 (현재 선택된 반의 개별 커스텀 D-Day가 있으면 우선 표시, 없으면 가장 가까운 주요 일정)
  if (classDDay && classDDay.targetYmd) {
    const targetYmd = classDDay.targetYmd;
    const dday = calculateDDay(targetYmd);
    const dDate = parseYMDString(targetYmd);

    if (bannerTitle) bannerTitle.textContent = classDDay.title;
    if (bannerCount) bannerCount.textContent = dday === 0 ? 'D-Day' : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;
    if (bannerDate) bannerDate.textContent = `${String(dDate.getMonth()+1).padStart(2,'0')}.${String(dDate.getDate()).padStart(2,'0')} (${WEEKDAYS[dDate.getDay()]})`;
  } else if (majorEvents.length > 0) {
    const next = majorEvents[0];
    const dday = calculateDDay(next.AA_YMD);
    const dDate = parseYMDString(next.AA_YMD);

    if (bannerTitle) bannerTitle.textContent = next.DISPLAY_NM || next.EVENT_NM;
    if (bannerCount) bannerCount.textContent = dday === 0 ? 'D-Day' : `D-${dday}`;
    if (bannerDate) bannerDate.textContent = `${String(dDate.getMonth()+1).padStart(2,'0')}.${String(dDate.getDate()).padStart(2,'0')} (${WEEKDAYS[dDate.getDay()]})`;
  }

  // 상단 배너 서브텍스트: 금호고 공식 구호로 상시 고정
  if (bannerSub) {
    bannerSub.textContent = '꿈을 향해 진취(進取)하는 금호인!';
  }

  // D-Day 그리드 카드 (지필평가는 첫 날만 남기고 최대 4개 대표 일정)
  if (ddayGrid) {
    if (majorEvents.length === 0) {
      ddayGrid.innerHTML = `
        <div class="col-span-full text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-400">
          남은 주요 시험/행사 일정이 없습니다.
        </div>
      `;
    } else {
      ddayGrid.innerHTML = majorEvents.slice(0, 4).map(ev => {
        const dday = calculateDDay(ev.AA_YMD);
        const dDate = parseYMDString(ev.AA_YMD);
        const isExam = ev.EVENT_NM.includes('정기시험') || ev.EVENT_NM.includes('지필') || ev.EVENT_NM.includes('수능') || ev.EVENT_NM.includes('평가');
        const title = ev.DISPLAY_NM || ev.EVENT_NM;

        return `
          <div class="sched-dday-kiosk-card ${isExam ? 'is-exam' : ''}">
            <div class="flex items-center justify-between gap-1">
              <span class="text-[11px] xl:text-xs font-black text-slate-800 dark:text-slate-200 truncate" title="${title}">${title}</span>
              <span class="text-[10px] xl:text-[11px] text-slate-400 font-bold shrink-0">${dDate.getMonth()+1}.${dDate.getDate()}</span>
            </div>
            <div class="mt-1 flex items-baseline justify-between">
              <span class="text-xl xl:text-2xl font-black ${isExam ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'}">${dday === 0 ? 'D-Day' : `D-${dday}`}</span>
              <span class="text-[10px] font-bold text-slate-400">${isExam ? '중요 시험' : '학사 일정'}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// 9-1. 주요 D-Day 설정 모달 관리 (반별 개별 저장 지원)
function initDDayModal() {
  const modal = document.getElementById('modal-dday-setting');
  const banner = document.getElementById('top-dday-banner');
  const btnClose = document.getElementById('btn-close-dday-modal');
  const btnSave = document.getElementById('btn-save-dday');
  const btnReset = document.getElementById('btn-reset-dday');

  const tabSchedule = document.getElementById('tab-dday-mode-schedule');
  const tabCustom = document.getElementById('tab-dday-mode-custom');
  const secSchedule = document.getElementById('section-dday-from-schedule');
  const secCustom = document.getElementById('section-dday-custom');

  const eventListEl = document.getElementById('dday-schedule-event-list');
  const inputTitle = document.getElementById('input-custom-dday-title');
  const inputDate = document.getElementById('input-custom-dday-date');

  let currentMode = 'schedule';

  function setMode(mode) {
    currentMode = mode;
    if (mode === 'schedule') {
      tabSchedule?.classList.add('bg-white', 'dark:bg-slate-800', 'text-brand-700', 'dark:text-brand-300', 'shadow-xs', 'font-bold');
      tabSchedule?.classList.remove('text-slate-600', 'dark:text-slate-400');
      tabCustom?.classList.remove('bg-white', 'dark:bg-slate-800', 'text-brand-700', 'dark:text-brand-300', 'shadow-xs', 'font-bold');
      tabCustom?.classList.add('text-slate-600', 'dark:text-slate-400');
      secSchedule?.classList.remove('hidden');
      secCustom?.classList.add('hidden');
    } else {
      tabCustom?.classList.add('bg-white', 'dark:bg-slate-800', 'text-brand-700', 'dark:text-brand-300', 'shadow-xs', 'font-bold');
      tabCustom?.classList.remove('text-slate-600', 'dark:text-slate-400');
      tabSchedule?.classList.remove('bg-white', 'dark:bg-slate-800', 'text-brand-700', 'dark:text-brand-300', 'shadow-xs', 'font-bold');
      tabSchedule?.classList.add('text-slate-600', 'dark:text-slate-400');
      secCustom?.classList.remove('hidden');
      secSchedule?.classList.add('hidden');
    }
  }

  tabSchedule?.addEventListener('click', () => setMode('schedule'));
  tabCustom?.addEventListener('click', () => setMode('custom'));

  banner?.addEventListener('click', () => {
    openDDayModal();
  });

  btnClose?.addEventListener('click', () => {
    closeModal('modal-dday-setting');
  });

  btnSave?.addEventListener('click', () => {
    const myGrade = state.selectedGrade || 1;
    const myClass = state.selectedClass || 1;

    if (currentMode === 'schedule') {
      const selectedRadio = eventListEl?.querySelector('input[type="radio"]:checked');
      if (!selectedRadio) {
        showToast('학사일정 중 하나를 선택해주세요.');
        return;
      }
      const targetYmd = selectedRadio.value;
      const title = selectedRadio.dataset.title || '';
      saveClassPrimaryDDay({ type: 'schedule', targetYmd, title }, myGrade, myClass);
      setupMajorDDays();
      closeModal('modal-dday-setting');
      showToast(`${myGrade}학년 ${myClass}반 주요 D-Day로 '${title}' 일정이 설정되었습니다!`);
    } else {
      const title = inputTitle?.value?.trim();
      const dateVal = inputDate?.value;
      if (!title) {
        showToast('D-Day 제목을 입력해주세요.');
        inputTitle?.focus();
        return;
      }
      if (!dateVal) {
        showToast('목표 날짜를 선택해주세요.');
        inputDate?.focus();
        return;
      }
      const targetYmd = dateVal.replace(/-/g, '');
      saveClassPrimaryDDay({ type: 'custom', targetYmd, title }, myGrade, myClass);
      setupMajorDDays();
      closeModal('modal-dday-setting');
      showToast(`${myGrade}학년 ${myClass}반 주요 D-Day로 '${title}' 일정이 설정되었습니다!`);
    }
  });

  btnReset?.addEventListener('click', () => {
    const myGrade = state.selectedGrade || 1;
    const myClass = state.selectedClass || 1;
    saveClassPrimaryDDay(null, myGrade, myClass);
    setupMajorDDays();
    closeModal('modal-dday-setting');
    showToast(`${myGrade}학년 ${myClass}반의 기본 추천 D-Day로 복원되었습니다.`);
  });
}

function openDDayModal() {
  const eventListEl = document.getElementById('dday-schedule-event-list');
  const inputTitle = document.getElementById('input-custom-dday-title');
  const inputDate = document.getElementById('input-custom-dday-date');
  const modalTitle = document.getElementById('modal-dday-title');
  const modalSub = document.getElementById('modal-dday-sub');

  const myGrade = state.selectedGrade || 1;
  const myClass = state.selectedClass || 1;
  const classDDay = syncCurrentClassPrimaryDDay(myGrade, myClass);

  if (modalTitle) {
    modalTitle.textContent = `${myGrade}학년 ${myClass}반 주요 D-Day 설정`;
  }
  if (modalSub) {
    modalSub.textContent = `${myGrade}학년 ${myClass}반 전자칠판에 표시될 전용 D-Day를 설정합니다.`;
  }

  const candidateEvents = getMajorEventsForDDay(myGrade);

  if (eventListEl) {
    if (candidateEvents.length === 0) {
      eventListEl.innerHTML = '<p class="text-xs text-slate-400 py-3 text-center">선택 가능한 주요 학사일정이 없습니다.</p>';
    } else {
      eventListEl.innerHTML = candidateEvents.map((ev, idx) => {
        const dday = calculateDDay(ev.AA_YMD);
        const dDate = parseYMDString(ev.AA_YMD);
        const title = ev.DISPLAY_NM || ev.EVENT_NM;
        const isChecked = (classDDay && classDDay.targetYmd === ev.AA_YMD) ||
                          (!classDDay && idx === 0);

        return `
          <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer border ${isChecked ? 'border-brand-500 dark:border-brand-400 bg-brand-50/40 dark:bg-brand-950/20' : 'border-slate-200/60 dark:border-slate-700'} transition">
            <div class="flex items-center space-x-2.5 min-w-0 pr-2">
              <input type="radio" name="dday-schedule-choice" value="${ev.AA_YMD}" data-title="${title}" class="rounded-full text-brand-600 focus:ring-brand-500 w-4 h-4 shrink-0" ${isChecked ? 'checked' : ''}>
              <div class="truncate">
                <p class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${title}</p>
                <p class="text-[10px] text-slate-400">${dDate.getFullYear()}.${String(dDate.getMonth()+1).padStart(2,'0')}.${String(dDate.getDate()).padStart(2,'0')} (${WEEKDAYS[dDate.getDay()]})</p>
              </div>
            </div>
            <span class="text-xs font-black ${dday <= 7 ? 'text-amber-500' : 'text-brand-600 dark:text-brand-400'} shrink-0">${dday === 0 ? 'D-Day' : `D-${dday}`}</span>
          </label>
        `;
      }).join('');
    }
  }

  if (classDDay && classDDay.type === 'custom') {
    if (inputTitle) inputTitle.value = classDDay.title || '';
    if (inputDate) {
      const ymd = classDDay.targetYmd;
      if (ymd && ymd.length === 8) {
        inputDate.value = `${ymd.substring(0,4)}-${ymd.substring(4,6)}-${ymd.substring(6,8)}`;
      }
    }
    document.getElementById('tab-dday-mode-custom')?.click();
  } else {
    if (inputTitle) inputTitle.value = '';
    if (inputDate) inputDate.value = '';
    document.getElementById('tab-dday-mode-schedule')?.click();
  }

  openModal('modal-dday-setting');
}

// 10. 금호고등학교 나이스(NEIS) 공식 실시간 시간표 연동 시스템
// 각 학년/반별 실제 등록 시간표를 일자별 병렬 조회(Promise.all)하여 주간 시간표 구성
async function fetchSingleDayTimetable(grade, classNm, ymd) {
  try {
    const url = `${CONFIG.API_BASE}/hisTimetable?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${CONFIG.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${CONFIG.SD_SCHUL_CODE}&GRADE=${grade}&CLASS_NM=${classNm}&TI_FROM_YMD=${ymd}&TI_TO_YMD=${ymd}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    if (data.hisTimetable && data.hisTimetable[1]?.row && Array.isArray(data.hisTimetable[1].row)) {
      return data.hisTimetable[1].row;
    }
    return [];
  } catch (err) {
    console.warn(`[NEIS Timetable] Fetch failed for ${ymd}:`, err.message);
    return [];
  }
}

// 금호고등학교 1학년 1~9반 공식 시간표 (2026.09.12 교육과정 개편 공식 배정안 반영)
const KUMHO_GRADE1_OFFICIAL_TIMETABLE = {
  1: {
    // 월요일
    '0_1': '진로활동', '0_2': '공통국어2', '0_3': '인간과 경제활동', '0_4': '통합사회2', '0_5': '음악 연주와 창작', '0_6': '통합과학2', '0_7': '통합사회2',
    // 화요일
    '1_1': '한국사2', '1_2': '통합사회2', '1_3': '공통수학2', '1_4': '공통국어2', '1_5': '체육2', '1_6': '공통영어2', '1_7': '통합과학2',
    // 수요일
    '2_1': '인간과 경제활동', '2_2': '공통국어2', '2_3': '공통수학2', '2_4': '한국사2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '공통수학2', '3_2': '과학탐구실험2', '3_3': '공통국어2', '3_4': '공통영어2', '3_5': '한국사2', '3_7': '체육2',
    // 금요일
    '4_1': '공통영어2', '4_2': '공통수학2', '4_3': '통합과학2', '4_4': '통합사회2', '4_5': '공통영어2', '4_6': '통합과학2', '4_7': '음악 연주와 창작'
  },
  2: {
    // 월요일
    '0_1': '진로활동', '0_2': '공통국어2', '0_3': '통합사회2', '0_4': '한국사2', '0_5': '공통국어2', '0_6': '공통수학2', '0_7': '통합사회2',
    // 화요일
    '1_1': '인간과 경제활동', '1_2': '통합과학2', '1_3': '통합사회2', '1_4': '공통영어2', '1_5': '공통수학2', '1_6': '체육2', '1_7': '공통영어2',
    // 수요일
    '2_1': '음악 연주와 창작', '2_2': '통합과학2', '2_3': '한국사2', '2_4': '공통영어2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '공통영어2', '3_2': '통합과학2', '3_3': '공통수학2', '3_4': '통합사회2', '3_5': '통합과학2', '3_7': '음악 연주와 창작',
    // 금요일
    '4_1': '공통국어2', '4_2': '인간과 경제활동', '4_3': '체육2', '4_4': '공통수학2', '4_5': '과학탐구실험2', '4_6': '공통국어2', '4_7': '한국사2'
  },
  3: {
    // 월요일
    '0_1': '진로활동', '0_2': '공통영어2', '0_3': '통합사회2', '0_4': '공통수학2', '0_5': '공통국어2', '0_6': '인간과 경제활동', '0_7': '통합과학2',
    // 화요일
    '1_1': '공통국어2', '1_2': '공통수학2', '1_3': '통합과학2', '1_4': '공통국어2', '1_5': '음악 연주와 창작', '1_6': '통합과학2', '1_7': '통합사회2',
    // 수요일
    '2_1': '한국사2', '2_2': '통합과학2', '2_3': '공통영어2', '2_4': '과학탐구실험2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '한국사2', '3_2': '통합사회2', '3_3': '체육2', '3_4': '공통수학2', '3_5': '공통국어2', '3_7': '인간과 경제활동',
    // 금요일
    '4_1': '통합사회2', '4_2': '공통영어2', '4_3': '한국사2', '4_4': '음악 연주와 창작', '4_5': '공통수학2', '4_6': '체육2', '4_7': '공통영어2'
  },
  4: {
    // 월요일
    '0_1': '진로활동', '0_2': '공통수학2', '0_3': '과학탐구실험2', '0_4': '한국사2', '0_5': '공통영어2', '0_6': '통합사회2', '0_7': '공통영어2',
    // 화요일
    '1_1': '공통국어2', '1_2': '음악 연주와 창작', '1_3': '공통국어2', '1_4': '통합과학2', '1_5': '통합과학2', '1_6': '공통수학2', '1_7': '공통영어2',
    // 수요일
    '2_1': '공통수학2', '2_2': '인간과 경제활동', '2_3': '체육2', '2_4': '공통국어2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '통합사회2', '3_2': '음악 연주와 창작', '3_3': '통합과학2', '3_4': '공통국어2', '3_5': '통합사회2', '3_7': '한국사2',
    // 금요일
    '4_1': '통합과학2', '4_2': '공통영어2', '4_3': '통합사회2', '4_4': '인간과 경제활동', '4_5': '체육2', '4_6': '한국사2', '4_7': '공통수학2'
  },
  5: {
    // 월요일
    '0_1': '진로활동', '0_2': '통합과학2', '0_3': '공통영어2', '0_4': '통합사회2', '0_5': '공통수학2', '0_6': '한국사2', '0_7': '공통국어2',
    // 화요일
    '1_1': '과학탐구실험2', '1_2': '공통국어2', '1_3': '공통영어2', '1_4': '통합사회2', '1_5': '공통수학2', '1_6': '인간과 경제활동', '1_7': '한국사2',
    // 수요일
    '2_1': '통합과학2', '2_2': '체육2', '2_3': '통합과학2', '2_4': '통합사회2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '공통국어2', '3_2': '인간과 경제활동', '3_3': '공통수학2', '3_4': '음악 연주와 창작', '3_5': '체육2', '3_7': '통합사회2',
    // 금요일
    '4_1': '공통수학2', '4_2': '공통국어2', '4_3': '한국사2', '4_4': '통합과학2', '4_5': '공통영어2', '4_6': '음악 연주와 창작', '4_7': '공통영어2'
  },
  6: {
    // 월요일
    '0_1': '진로활동', '0_2': '통합과학2', '0_3': '공통수학2', '0_4': '과학탐구실험2', '0_5': '인간과 경제활동', '0_6': '체육2', '0_7': '공통영어2',
    // 화요일
    '1_1': '통합사회2', '1_2': '공통수학2', '1_3': '통합사회2', '1_4': '한국사2', '1_5': '공통국어2', '1_6': '공통영어2', '1_7': '공통국어2',
    // 수요일
    '2_1': '공통수학2', '2_2': '통합사회2', '2_3': '공통영어2', '2_4': '통합과학2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '음악 연주와 창작', '3_2': '체육2', '3_3': '공통영어2', '3_4': '통합과학2', '3_5': '한국사2', '3_7': '공통수학2',
    // 금요일
    '4_1': '공통국어2', '4_2': '통합과학2', '4_3': '음악 연주와 창작', '4_4': '공통국어2', '4_5': '인간과 경제활동', '4_6': '통합사회2', '4_7': '한국사2'
  },
  7: {
    // 월요일
    '0_1': '진로활동', '0_2': '한국사2', '0_3': '공통국어2', '0_4': '체육2', '0_5': '통합사회2', '0_6': '음악 연주와 창작', '0_7': '공통수학2',
    // 화요일
    '1_1': '인간과 경제활동', '1_2': '통합과학2', '1_3': '체육2', '1_4': '공통영어2', '1_5': '한국사2', '1_6': '공통영어2', '1_7': '통합과학2',
    // 수요일
    '2_1': '공통국어2', '2_2': '음악 연주와 창작', '2_3': '과학탐구실험2', '2_4': '공통수학2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '공통수학2', '3_2': '한국사2', '3_3': '통합사회2', '3_4': '공통국어2', '3_5': '공통영어2', '3_7': '인간과 경제활동',
    // 금요일
    '4_1': '통합과학2', '4_2': '공통국어2', '4_3': '통합사회2', '4_4': '공통수학2', '4_5': '공통영어2', '4_6': '통합과학2', '4_7': '통합사회2'
  },
  8: {
    // 월요일
    '0_1': '진로활동', '0_2': '음악 연주와 창작', '0_3': '체육2', '0_4': '통합과학2', '0_5': '통합과학2', '0_6': '공통영어2', '0_7': '한국사2',
    // 화요일
    '1_1': '공통영어2', '1_2': '한국사2', '1_3': '공통수학2', '1_4': '통합사회2', '1_5': '인간과 경제활동', '1_6': '통합사회2', '1_7': '음악 연주와 창작',
    // 수요일
    '2_1': '공통국어2', '2_2': '공통수학2', '2_3': '한국사2', '2_4': '공통국어2', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '과학탐구실험2', '3_2': '공통국어2', '3_3': '통합과학2', '3_4': '공통수학2', '3_5': '공통영어2', '3_7': '통합과학2',
    // 금요일
    '4_1': '통합사회2', '4_2': '체육2', '4_3': '공통영어2', '4_4': '통합사회2', '4_5': '공통국어2', '4_6': '공통수학2', '4_7': '인간과 경제활동'
  },
  9: {
    // 월요일
    '0_1': '진로활동', '0_2': '공통영어2', '0_3': '공통수학2', '0_4': '통합과학2', '0_5': '인간과 경제활동', '0_6': '공통국어2', '0_7': '공통국어2',
    // 화요일
    '1_1': '음악 연주와 창작', '1_2': '공통영어2', '1_3': '통합과학2', '1_4': '체육2', '1_5': '통합과학2', '1_6': '통합사회2', '1_7': '인간과 경제활동',
    // 수요일
    '2_1': '공통수학2', '2_2': '한국사2', '2_3': '통합사회2', '2_4': '음악 연주와 창작', '2_6': '자율·자치활동', '2_7': '자율·자치활동',
    // 목요일
    '3_1': '한국사2', '3_2': '공통영어2', '3_3': '공통영어2', '3_4': '과학탐구실험2', '3_5': '공통수학2', '3_7': '통합과학2',
    // 금요일
    '4_1': '공통수학2', '4_2': '통합사회2', '4_3': '공통국어2', '4_4': '한국사2', '4_5': '체육2', '4_6': '통합사회2', '4_7': '공통국어2'
  }
};

// 2, 3학년 정규 교과목 배정 및 보완 데이터베이스
const KUMHO_SUPPLEMENTAL_BY_GRADE = {
  1: KUMHO_GRADE1_OFFICIAL_TIMETABLE,
  2: {
    1: { '0_6': '경제 수학', '0_7': '화법과 언어', '1_6': '화법과 언어', '1_7': '영어Ⅱ', '3_7': '스포츠 생활2', '4_6': '영어Ⅱ', '4_7': '진로활동' },
    2: { '0_6': '문학', '0_7': '영어Ⅱ', '1_6': '수학Ⅰ', '1_7': '물리학Ⅰ', '3_7': '생활과 윤리', '4_6': '체육', '4_7': '한국지리' },
    3: { '0_6': '영어Ⅱ', '0_7': '미적분Ⅰ', '1_6': '문학', '1_7': '화학Ⅰ', '3_7': '체육', '4_6': '사회·문화', '4_7': '일본어Ⅰ' },
    4: { '0_6': '미적분Ⅰ', '0_7': '문학', '1_6': '생명과학Ⅰ', '1_7': '영어Ⅱ', '3_7': '정치와 법', '4_6': '체육', '4_7': '수학Ⅰ' }
  },
  3: {
    1: { '0_6': '독서', '0_7': '화법과 작문', '1_6': '진로와 직업', '1_7': '생활과 과학', '3_7': '화법과 작문', '4_6': '미적분', '4_7': '수능특강 영어' },
    2: { '0_6': '미적분', '0_7': '수능특강 영어', '1_6': '독서', '1_7': '화법과 작문', '3_7': '체육탐구', '4_6': '사회문제 탐구', '4_7': '심화영어Ⅰ' },
    3: { '0_6': '수능특강 영어', '0_7': '미적분', '1_6': '화법과 작문', '1_7': '독서', '3_7': '스포츠 생활', '4_6': '생활과 과학', '4_7': '미술사' }
  }
};

function getSupplementalSubject(grade, classNm, dayOffset, period) {
  const g = parseInt(grade, 10) || 1;
  const c = parseInt(classNm, 10) || 1;
  const key = `${dayOffset}_${period}`;

  if (g === 1) {
    const cSafe = Math.min(Math.max(c, 1), 9);
    if (KUMHO_GRADE1_OFFICIAL_TIMETABLE[cSafe] && KUMHO_GRADE1_OFFICIAL_TIMETABLE[cSafe][key]) {
      return KUMHO_GRADE1_OFFICIAL_TIMETABLE[cSafe][key];
    }
    return '공통교과';
  }

  if (KUMHO_SUPPLEMENTAL_BY_GRADE[g] && KUMHO_SUPPLEMENTAL_BY_GRADE[g][c] && KUMHO_SUPPLEMENTAL_BY_GRADE[g][c][key]) {
    return KUMHO_SUPPLEMENTAL_BY_GRADE[g][c][key];
  }

  // 기본 2, 3학년 대표 교과목 풀
  if (g === 2) {
    const pool = ['화법과 언어', '미적분Ⅰ', '영어Ⅱ', '경제 수학', '스포츠 생활2', '문학', '생활과 윤리'];
    return pool[(c * 2 + dayOffset * 3 + period) % pool.length];
  } else {
    const pool = ['화법과 작문', '미적분', '수능특강 영어', '독서', '생활과 과학', '스포츠 생활', '미술사'];
    return pool[(c * 2 + dayOffset * 3 + period) % pool.length];
  }
}

// 주간 5일(월~금) 실제 시간표 획득 (1학년 공식 시간표 0ms 직접 생성 / 2, 3학년 로컬 캐시 및 병렬 실시간 API)
async function fetchWeeklyTimetable(grade, classNm, fromYmd, toYmd, forceRefresh = false) {
  const safeGrade = parseInt(grade, 10) || 1;
  const safeClass = Math.min(Math.max(parseInt(classNm, 10) || 1, 1), 9);
  const cacheKey = `kumho_real_tt_v7_${safeGrade}_${safeClass}_${fromYmd}_${toYmd}`;
  const monday = parseYMDString(fromYmd);

  // 1) 1학년의 경우 학교 공식 개편안(2026.09.12) 내장 마스터 시간표를 네트워크·스토리지 영향 없이 0ms 즉시 생성 반환
  if (safeGrade === 1) {
    if (!forceRefresh && Array.isArray(state.cache.timetables[cacheKey]) && state.cache.timetables[cacheKey].length > 0) {
      return state.cache.timetables[cacheKey];
    }
    const classTable = KUMHO_GRADE1_OFFICIAL_TIMETABLE[safeClass] || KUMHO_GRADE1_OFFICIAL_TIMETABLE[1];
    const rows = [];
    for (let offset = 0; offset < 5; offset++) {
      const targetDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + offset);
      const ymd = formatDateYYYYMMDD(targetDate);
      for (let p = 1; p <= 7; p++) {
        const sub = classTable[`${offset}_${p}`];
        if (sub) {
          rows.push({
            ATPT_OFCDC_SC_CODE: CONFIG.ATPT_OFCDC_SC_CODE,
            SD_SCHUL_CODE: CONFIG.SD_SCHUL_CODE,
            AY: '2026',
            SEM: '2',
            ALL_TI_YMD: ymd,
            GRADE: '1',
            CLASS_NM: String(safeClass),
            PERIO: String(p),
            ITRT_CNTNT: sub
          });
        }
      }
    }
    state.cache.timetables[cacheKey] = rows;
    return rows;
  }

  // 2) 메모리 캐시 확인 (2, 3학년)
  if (!forceRefresh && Array.isArray(state.cache.timetables[cacheKey]) && state.cache.timetables[cacheKey].length > 0) {
    return state.cache.timetables[cacheKey];
  }

  // 3) 로컬스토리지 영구 캐시 확인 (6시간 유효, 빈 배열 제외)
  if (!forceRefresh) {
    try {
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.rows) && parsed.rows.length > 0 && (Date.now() - (parsed.timestamp || 0)) < 1000 * 60 * 60 * 6) {
          state.cache.timetables[cacheKey] = parsed.rows;
          return parsed.rows;
        }
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
  }

  // 4) 2, 3학년의 경우 나이스 Open API로 5일치를 동시 병렬 요청 (0.2~0.5초 고속 수신)
  const weekYmds = [];
  for (let i = 0; i < 5; i++) {
    const targetDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    weekYmds.push(formatDateYYYYMMDD(targetDate));
  }

  const dayResults = await Promise.all(
    weekYmds.map(ymd => fetchSingleDayTimetable(safeGrade, safeClass, ymd))
  );

  const allRows = dayResults.flat();

  state.cache.timetables[cacheKey] = allRows;
  if (allRows.length > 0) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        rows: allRows
      }));
    } catch (e) {}
  }

  return allRows;
}

// 시간표 및 일정 제목에서 괄호 등 부가 표기 제거 및 정기시험 통일 헬퍼
function stripExtraAnnotations(title) {
  if (!title) return '';
  return title.replace(new RegExp('\\s*\\([^)]*\\)', 'g'), '').replace(new RegExp('지필평가', 'g'), '정기시험').trim();
}

// 시간표 및 홈 대시보드 공휴일별 맞춤 이모티콘 및 설명 생성 헬퍼
function getHolidayPresentation(event) {
  const name = (event && event.EVENT_NM) || '휴일';
  const cntnt = (event && event.EVENT_CNTNT) || '';
  const combined = `${name} ${cntnt}`;

  // 1) 국가기념일 및 국경일 (삼일절, 현충일, 광복절, 개천절, 한글날, 제헌절, 국군의 날 등 및 그 대체공휴일)
  // 사용자 요구사항: 국가기념일(예/ 3.1절, 현충일 등)은 대한민국 국기 이모티콘(🇰🇷)과 함께 적절한 설명을 아래에 대신해서 작성하기
  if (combined.includes('현충일')) {
    return {
      emoji: '🇰🇷',
      badge: '국가추모일',
      cleanName: '현충일',
      descTable: '순국선열과 호국영령의 숭고한 희생을 기립니다 (조기 게양)',
      descHome: '순국선열과 호국영령의 숭고한 희생을 기리고 조기를 게양합니다. 🇰🇷',
      isNational: true
    };
  }
  if (combined.includes('삼일절') || combined.includes('3·1') || combined.includes('3.1')) {
    const isAlt = combined.includes('대체');
    return {
      emoji: '🇰🇷',
      badge: isAlt ? '대체공휴일' : '국경일',
      cleanName: isAlt ? '삼일절 대체공휴일' : '삼일절',
      descTable: isAlt ? '3·1절 대체공휴일입니다 (태극기 게양)' : '3·1 만세운동의 숭고한 자주독립 정신을 기립니다 (국기 게양)',
      descHome: isAlt ? '삼일절 대체공휴일입니다. 뜻깊고 평온한 휴일 보내세요! 🇰🇷' : '3·1 만세운동의 자주독립 정신을 기리며 태극기를 게양합시다. 🇰🇷',
      isNational: true
    };
  }
  if (combined.includes('광복절')) {
    const isAlt = combined.includes('대체');
    return {
      emoji: '🇰🇷',
      badge: isAlt ? '대체공휴일' : '국경일',
      cleanName: isAlt ? '광복절 대체공휴일' : '광복절',
      descTable: isAlt ? '광복절 대체공휴일입니다 (태극기 게양)' : '조국의 광복과 국권 회복을 경축합니다 (국기 게양)',
      descHome: isAlt ? '광복절 대체공휴일입니다. 뜻깊고 평온한 휴일 보내세요! 🇰🇷' : '조국의 독립과 광복의 기쁨을 되새기며 태극기를 게양합시다. 🇰🇷',
      isNational: true
    };
  }
  if (combined.includes('개천절')) {
    const isAlt = combined.includes('대체');
    return {
      emoji: '🇰🇷',
      badge: isAlt ? '대체공휴일' : '국경일',
      cleanName: isAlt ? '개천절 대체공휴일' : '개천절',
      descTable: isAlt ? '개천절 대체공휴일입니다 (태극기 게양)' : '하늘이 열린 날, 고조선 건국을 기념합니다 (국기 게양)',
      descHome: isAlt ? '개천절 대체공휴일입니다. 편안하고 뜻깊은 휴일 보내세요! 🇰🇷' : '단군왕검의 고조선 건국을 기념하며 태극기를 게양합시다. 🇰🇷',
      isNational: true
    };
  }
  if (combined.includes('한글날')) {
    const isAlt = combined.includes('대체');
    return {
      emoji: '🇰🇷',
      badge: isAlt ? '대체공휴일' : '국경일',
      cleanName: isAlt ? '한글날 대체공휴일' : '한글날',
      descTable: isAlt ? '한글날 대체공휴일입니다 (태극기 게양)' : '훈민정음 반포와 한글의 독창성을 기립니다 (국기 게양)',
      descHome: isAlt ? '한글날 대체공휴일입니다. 아름다운 한글을 되새기는 하루 보내세요! 🇰🇷' : '훈민정음 반포와 자랑스러운 우리말 한글을 기리며 태극기를 게양합시다. 🇰🇷',
      isNational: true
    };
  }
  if (combined.includes('제헌절')) {
    return {
      emoji: '🇰🇷',
      badge: '국경일',
      cleanName: '제헌절',
      descTable: '대한민국 헌법 제정을 경축합니다 (국기 게양)',
      descHome: '자유민주주의 헌법 제정을 기념하는 뜻깊은 국경일입니다. 🇰🇷',
      isNational: true
    };
  }
  if (combined.includes('국군의 날') || combined.includes('국군의날')) {
    return {
      emoji: '🇰🇷',
      badge: '국가기념일',
      cleanName: '국군의 날',
      descTable: '국군의 위용과 국방의 소중함을 기립니다 (국기 게양)',
      descHome: '국군 장병들의 노고와 국방의 소중함을 기리는 날입니다. 🇰🇷',
      isNational: true
    };
  }

  // 2) 1, 2학년의 수능일 (재량휴업일)
  if (combined.includes('수능') || combined.includes('대학수학능력시험')) {
    return {
      emoji: '🏫',
      badge: '재량휴업',
      cleanName: '재량휴업일 (수능일)',
      descTable: '수능 고사장 운영에 따른 1·2학년 재량휴업일 (정규 수업 없음)',
      descHome: '수능 고사장 운영에 따른 재량휴업일입니다. 알찬 자기계발 시간 보내세요! 🏫',
      isNational: false
    };
  }

  // 3) 전통 명절 및 연휴
  if (combined.includes('추석') || combined.includes('한가위')) {
    return {
      emoji: '🌕',
      badge: '명절연휴',
      cleanName: stripExtraAnnotations(name),
      descTable: '풍요롭고 따뜻한 한가위 명절 연휴 (수업 없음)',
      descHome: '보름달처럼 풍요롭고 따뜻한 한가위 명절 보내세요! 🌕',
      isNational: false
    };
  }
  if (combined.includes('설날')) {
    return {
      emoji: '🌅',
      badge: '명절연휴',
      cleanName: stripExtraAnnotations(name),
      descTable: '민족 최대 명절 설 연휴 (수업 없음)',
      descHome: '새해 복 많이 받으시고 따뜻한 설 명절 보내세요! 🌅',
      isNational: false
    };
  }

  // 4) 기타 공휴일 및 학교 재량휴업일
  if (combined.includes('어린이날')) {
    return {
      emoji: '🎈',
      badge: '공휴일',
      cleanName: '어린이날',
      descTable: '어린이의 꿈과 희망을 응원하는 날 (수업 없음)',
      descHome: '꿈과 희망이 가득한 행복한 어린이날 보내세요! 🎈',
      isNational: false
    };
  }
  if (combined.includes('부처님오신날') || combined.includes('석가탄신일') || combined.includes('부처님')) {
    return {
      emoji: '🪷',
      badge: combined.includes('대체') ? '대체공휴일' : '공휴일',
      cleanName: combined.includes('대체') ? '부처님오신날 대체공휴일' : '부처님오신날',
      descTable: '자비와 평화의 부처님오신날 (수업 없음)',
      descHome: '자비와 온기가 가득한 평온한 휴일 보내세요! 🪷',
      isNational: false
    };
  }
  if (combined.includes('성탄절') || combined.includes('크리스마스')) {
    return {
      emoji: '🎄',
      badge: '공휴일',
      cleanName: '성탄절',
      descTable: '기쁨과 축복의 성탄절 크리스마스 (수업 없음)',
      descHome: '사랑과 축복이 넘치는 따뜻한 성탄절 보내세요! 🎄',
      isNational: false
    };
  }
  if (combined.includes('신정') || combined.includes('새해')) {
    return {
      emoji: '🌅',
      badge: '공휴일',
      cleanName: '신정 (새해 첫날)',
      descTable: '새로운 한 해를 시작하는 새해 첫날 (수업 없음)',
      descHome: '희망찬 새해 첫날, 올 한 해도 힘차게 출발하세요! 🌅',
      isNational: false
    };
  }
  if (combined.includes('재량휴업') || combined.includes('개교기념일')) {
    return {
      emoji: '🏫',
      badge: '재량휴업',
      cleanName: stripExtraAnnotations(name),
      descTable: '학교 재량휴업일 (1~7교시 정규 수업 없음)',
      descHome: '학교 재량휴업일입니다. 알차고 유익한 하루 보내세요! 🏫',
      isNational: false
    };
  }

  // 5) 기본 일반 휴일
  return {
    emoji: '🎉',
    badge: '휴일',
    cleanName: stripExtraAnnotations(name),
    descTable: '1~7교시 정규 수업 없음',
    descHome: '정규 수업이 없는 휴일입니다. 즐겁고 알찬 하루 보내세요! 🎈',
    isNational: false
  };
}

// 주간 시간표 렌더링 (월요일부터 금요일까지 5일 전체 시간표 및 공강 표시)
async function renderTimetable(grade = state.selectedGrade, classNm = state.selectedClass, forceRefresh = false) {
  try {
    grade = parseInt(grade, 10) || state.selectedGrade || 1;
    classNm = Math.min(Math.max(parseInt(classNm, 10) || state.selectedClass || 1, 1), 9);

    if (!state.timetableMonday) {
      state.timetableMonday = getMondayOfWeek(state.currentDate);
    }

    const monday = new Date(state.timetableMonday);
    const friday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4);

    const fromYmd = formatDateYYYYMMDD(monday);
    const toYmd = formatDateYYYYMMDD(friday);

    const weekRangeEl = document.getElementById('timetable-week-range-str');
    const weekContainer = document.getElementById('timetable-week-container');
    const homeBadge = document.getElementById('home-class-badge');
    const homeTimetableList = document.getElementById('home-timetable-list');

    let subLabel = `${grade}학년 ${classNm}반`;
    if (homeBadge) homeBadge.textContent = subLabel;

    if (weekRangeEl) {
      const mStr = `${monday.getFullYear()}.${String(monday.getMonth() + 1).padStart(2, '0')}.${String(monday.getDate()).padStart(2, '0')}`;
      const fStr = `${String(friday.getMonth() + 1).padStart(2, '0')}.${String(friday.getDate()).padStart(2, '0')}`;
      weekRangeEl.textContent = `${mStr} (월) ~ ${fStr} (금)`;
    }

    // 캐시 여부 확인 및 첫 로딩/새로고침 시 스켈레톤 로딩 UI 표시 (1학년은 0ms 내장 데이터이므로 로딩 스피너 생략)
    const cacheKey = `kumho_real_tt_v7_${grade}_${classNm}_${fromYmd}_${toYmd}`;
    const isCached = (grade === 1) || (!forceRefresh && !!(state.cache.timetables[cacheKey] || localStorage.getItem(cacheKey)));
    if (weekContainer && !isCached) {
      weekContainer.innerHTML = `
        <div class="col-span-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-2.5">
          <div class="inline-block w-7 h-7 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-bold text-slate-800 dark:text-slate-100">${grade}학년 ${classNm}반 최신 배정 시간표를 불러오는 중...</p>
          <p class="text-[11px] text-slate-400">월요일부터 금요일까지 정규 배정 시간표를 동기화하고 있습니다.</p>
        </div>
      `;
    }

    // 시간표 데이터 획득 (캐시 0ms 즉각 반환 또는 나이스 병렬 실시간 호출)
    const rows = await fetchWeeklyTimetable(grade, classNm, fromYmd, toYmd, forceRefresh);

    // 주간 5일 (월~금) 데이터 가공
    const weekDays = [
      { name: '월요일', short: '월', offset: 0 },
      { name: '화요일', short: '화', offset: 1 },
      { name: '수요일', short: '수', offset: 2 },
      { name: '목요일', short: '목', offset: 3 },
      { name: '금요일', short: '금', offset: 4 }
    ];

    const todayYmd = formatDateYYYYMMDD(state.currentDate);

    const daysData = weekDays.map(d => {
      const targetDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + d.offset);
      const dayYmd = formatDateYYYYMMDD(targetDate);
      const isToday = (dayYmd === todayYmd);

      // 특정 행사가 현재 선택된 학년(grade)에 적용되는지 판별하는 함수
      const isForMyGrade = (ev) => {
        if (!ev) return false;
        const g = parseInt(grade, 10);
        if (g === 1 && ev.ONE_GRADE_EVENT_YN !== undefined) return ev.ONE_GRADE_EVENT_YN === 'Y';
        if (g === 2 && ev.TW_GRADE_EVENT_YN !== undefined) return ev.TW_GRADE_EVENT_YN === 'Y';
        if (g === 3 && ev.THREE_GRADE_EVENT_YN !== undefined) return ev.THREE_GRADE_EVENT_YN === 'Y';
        return true;
      };

      const isGrade3 = (parseInt(grade, 10) === 3);

      // 1) 휴업일/공휴일 판별 (한글날, 대체공휴일, 재량휴업일 등 - 해당 학년 대상 확인)
      // 3학년의 경우 수능(대학수학능력시험)은 공휴일이 아니라 시험일정이므로 휴업일에서 제외
      const holidayEvent = KUMHO_OFFICIAL_SCHEDULE.find(ev => {
        if (ev.AA_YMD !== dayYmd || !isForMyGrade(ev)) return false;
        const isSuneung = ev.EVENT_NM.includes('수능') || ev.EVENT_NM.includes('대학수학능력시험');
        if (isGrade3 && isSuneung) return false;
        return (ev.SBTR_DD_SC_NM === '휴업일' || ev.EVENT_NM.includes('휴업') || ev.EVENT_NM.includes('공휴일') || ev.EVENT_NM.includes('대체공휴일'));
      });

      // 2) 전일 학교 행사 (체육한마당, 테마형 교육여행, 수련회, 축제 등 - 해당 학년 대상 확인)
      const fullDayEvent = !holidayEvent && KUMHO_OFFICIAL_SCHEDULE.find(ev => ev.AA_YMD === dayYmd && isForMyGrade(ev) && (ev.EVENT_NM.includes('체육') || ev.EVENT_NM.includes('수학여행') || ev.EVENT_NM.includes('수련') || ev.EVENT_NM.includes('축제')));

      // 3) 모의고사 / 전국연합학력평가 / 수능 - 해당 학년 대상 확인
      const mockExamEvent = !holidayEvent && !fullDayEvent && KUMHO_OFFICIAL_SCHEDULE.find(ev => ev.AA_YMD === dayYmd && isForMyGrade(ev) && (ev.EVENT_NM.includes('학력평가') || ev.EVENT_NM.includes('모의') || ev.EVENT_NM.includes('수능') || ev.EVENT_NM.includes('대학수학능력시험')));

      // 4) 정기시험 (중간고사 / 기말고사 - 해당 학년 대상 확인)
      const paperExamEvent = !holidayEvent && !fullDayEvent && !mockExamEvent && KUMHO_OFFICIAL_SCHEDULE.find(ev => ev.AA_YMD === dayYmd && isForMyGrade(ev) && (ev.EVENT_NM.includes('정기시험') || ev.EVENT_NM.includes('지필평가') || ev.EVENT_NM.includes('중간고사') || ev.EVENT_NM.includes('기말고사')));

      let dayType = 'regular';
      if (holidayEvent) dayType = 'holiday';
      else if (fullDayEvent) dayType = 'fullday_event';
      else if (mockExamEvent) dayType = 'mock_exam';
      else if (paperExamEvent) dayType = 'paper_exam';

      const holidayInfo = holidayEvent ? getHolidayPresentation(holidayEvent) : null;

      // 해당 날짜의 수업 행 추출
      const dayRows = rows.filter(r => r.ALL_TI_YMD === dayYmd);
      const periodMap = {};
      dayRows.forEach(r => {
        const p = parseInt(r.PERIO, 10);
        if (!isNaN(p)) {
          periodMap[p] = r;
        }
      });

      // 1교시부터 7교시까지 생성
      const periods = [];
      for (let p = 1; p <= 7; p++) {
        const row = periodMap[p];
        let subject = '';
        let isFree = false;
        let isChangche = false;
        let freeNote = '';

        if (dayType === 'regular') {
          if (d.offset === 2 && p === 5) {
            // 수요일 5교시: 공강 (자율)
            subject = '공강';
            isFree = true;
            freeNote = '자율';
          } else if (d.offset === 3 && p === 6) {
            // 목요일 6교시: 공강 (자율)
            subject = '공강';
            isFree = true;
            freeNote = '자율';
          } else {
            const hasNeis = row && row.ITRT_CNTNT && row.ITRT_CNTNT.trim() !== '' && !row.ITRT_CNTNT.includes('휴업') && row.ITRT_CNTNT !== '공강';
            if (hasNeis) {
              subject = row.ITRT_CNTNT.trim();
            } else {
              subject = getSupplementalSubject(grade, classNm, d.offset, p);
            }

            // 창체 판정: 월요일 1교시, 수요일 6~7교시, 또는 과목명
            if ((d.offset === 0 && p === 1) || (d.offset === 2 && (p === 6 || p === 7)) ||
                subject === '진로활동' || subject === '자율·자치활동' || subject.includes('동아리') || subject.includes('창체')) {
              isChangche = true;
            }

            if (!subject || subject === '공강') {
              subject = '공강';
              isFree = true;
              freeNote = '자율';
            }
          }
        }

        periods.push({
          perio: p,
          subject,
          isFree,
          isChangche,
          freeNote,
          time: PERIOD_TIMES[p] || ''
        });
      }

      return {
        name: d.name,
        short: d.short,
        offset: d.offset,
        dayIndex: d.offset + 1,
        date: targetDate,
        dayYmd,
        isToday,
        dayType,
        holidayEvent,
        holidayInfo,
        fullDayEvent,
        mockExamEvent,
        paperExamEvent,
        periods
      };
    });

    state.lastRenderedDaysData = daysData;

    // 스마트폰 주간 시간표 셀 내부 과목명 의미 단위 줄바꿈 헬퍼 (전자칠판에서는 100% 원문 1줄 표시)
    const renderResponsiveSubjectHtml = (subject) => {
      if (!subject) return '';
      const s = subject.trim();
      const mobileBreakMap = {
        '음악 연주와 창작': '음악연주와<br>창작',
        '인간과 경제활동': '인간과<br>경제활동',
        '과학탐구실험2': '과학탐구<br>실험2',
        '과학탐구실험': '과학탐구<br>실험',
        '자율·자치활동': '자율·자치<br>활동',
        '자율자치활동': '자율자치<br>활동'
      };
      let mobileHtml = mobileBreakMap[s];
      if (!mobileHtml) {
        if (s.length >= 6 && s.includes(' ')) {
          const lastSpace = s.lastIndexOf(' ');
          mobileHtml = `${s.slice(0, lastSpace).replace(/\s+/g, '')}<br>${s.slice(lastSpace + 1)}`;
        } else {
          mobileHtml = s;
        }
      }
      return `<span class="tt-subj-desktop">${s}</span><span class="tt-subj-mobile">${mobileHtml}</span>`;
    };

    // 1) 주간 5일 통합 시간표 표(Table) 렌더링
    if (weekContainer) {
      let tableHtml = `
        <table class="timetable-table">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/90 text-xs">
              <th class="w-20 sm:w-28 py-3.5 px-2 text-slate-500 dark:text-slate-400 font-bold border-r border-slate-200 dark:border-slate-700">
                <span class="tt-th-desktop">교시 / 시간</span>
                <span class="tt-th-mobile">교시</span>
              </th>
              ${daysData.map(d => `
                <th data-mobile-day-offset="${d.offset}" class="py-3 px-2 border-r border-slate-200 dark:border-slate-700 ${d.isToday ? 'timetable-today-col text-brand-700 dark:text-brand-300 font-extrabold border-b-2 border-b-brand-500' : 'text-slate-800 dark:text-slate-100 font-bold'}">
                  <div class="flex flex-col items-center justify-center space-y-0.5">
                    <div class="flex items-center space-x-1 flex-wrap justify-center gap-0.5">
                      <span class="text-sm tt-day-full">${d.name}</span>
                      <span class="text-xs font-extrabold tt-day-short">${d.short}</span>
                      ${d.isToday ? '<span class="tt-th-badge text-[9px] px-1.5 py-0.2 bg-brand-500 text-white rounded-full font-bold">오늘</span>' : ''}
                      ${d.dayType === 'holiday' ? `<span class="tt-th-badge text-[9px] px-1.5 py-0.2 ${d.holidayInfo && d.holidayInfo.isNational ? 'bg-rose-600' : 'bg-rose-500'} text-white rounded-full font-bold">${d.holidayInfo ? d.holidayInfo.badge : '휴일'}</span>` : ''}
                      ${d.dayType === 'paper_exam' ? '<span class="tt-th-badge text-[9px] px-1.5 py-0.2 bg-amber-500 text-white rounded-full font-bold">정기시험</span>' : ''}
                      ${d.dayType === 'fullday_event' ? '<span class="tt-th-badge text-[9px] px-1.5 py-0.2 bg-indigo-600 text-white rounded-full font-bold">행사</span>' : ''}
                      ${d.dayType === 'mock_exam' ? `<span class="tt-th-badge text-[9px] px-1.5 py-0.2 bg-amber-600 text-white rounded-full font-bold">${d.mockExamEvent && d.mockExamEvent.EVENT_NM.includes('수학능력시험') ? '수능' : '모의평가'}</span>` : ''}
                    </div>
                    <span class="text-[10px] tt-day-date ${d.isToday ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-400'} font-normal">
                      ${d.date.getMonth() + 1}.${d.date.getDate()}
                    </span>
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
      `;

      // 8개 행 정의: 1~4교시, 점심시간, 5~7교시
      const rowSlots = [
        { type: 'period', perio: 1 },
        { type: 'period', perio: 2 },
        { type: 'period', perio: 3 },
        { type: 'period', perio: 4 },
        { type: 'lunch' },
        { type: 'period', perio: 5 },
        { type: 'period', perio: 6 },
        { type: 'period', perio: 7 }
      ];

      rowSlots.forEach((slot, rowIndex) => {
        tableHtml += `<tr class="${slot.type === 'lunch' ? 'tt-lunch-row' : 'tt-period-row'}">`;

        // 좌측 교시/시간 열 헤더
        if (slot.type === 'period') {
          const p = slot.perio;
          const timeFull = PERIOD_TIMES[p] || '';
          const timeShort = timeFull.split('~')[0] || '';
          tableHtml += `
            <td class="py-2.5 px-2 bg-slate-50/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-r border-b border-slate-200 dark:border-slate-700">
              <div class="text-xs sm:text-sm tt-perio-label"><span class="tt-perio-num">${p}</span><span class="tt-perio-unit">교시</span></div>
              <div class="text-[10px] text-slate-400 font-normal leading-tight mt-0.5 font-mono tt-perio-time">
                <span class="tt-time-full">${timeFull}</span>
                <span class="tt-time-short">${timeShort}</span>
              </div>
            </td>
          `;
        } else if (slot.type === 'lunch') {
          tableHtml += `
            <td class="py-2 px-2 bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 font-bold border-r border-b border-slate-200 dark:border-slate-700">
              <div class="text-xs tt-perio-label">점심<span class="tt-perio-unit">시간</span></div>
              <div class="text-[10px] text-amber-700/80 dark:text-amber-300 font-normal leading-tight mt-0.5 font-mono tt-perio-time">
                <span class="tt-time-full">12:30~13:30</span>
                <span class="tt-time-short">12:30</span>
              </div>
            </td>
          `;
        }

        // 5개 요일 셀 렌더링
        daysData.forEach(d => {
          const todayColClass = d.isToday ? 'timetable-today-col' : '';

          if (d.dayType === 'holiday') {
            // 휴업일/공휴일: 1교시 행에서 8개 행 전체를 하나로 묶어서 표시 (rowspan 8)
            if (rowIndex === 0) {
              const hInfo = d.holidayInfo || getHolidayPresentation(d.holidayEvent);
              tableHtml += `
                <td rowspan="8" class="tt-rowspan-cell p-3 sm:p-4 bg-rose-50/60 dark:bg-rose-950/25 border-r border-b border-slate-200 dark:border-slate-700 text-center align-middle ${todayColClass}">
                  <div class="flex flex-col items-center justify-center py-8 space-y-2 tt-rowspan-inner">
                    <span class="text-3xl tt-rowspan-emoji">${hInfo.emoji}</span>
                    <span class="font-extrabold text-sm sm:text-base text-rose-700 dark:text-rose-300 tt-rowspan-title">${hInfo.cleanName}</span>
                    <span class="text-[11px] px-2.5 py-0.5 rounded-full ${hInfo.isNational ? 'bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200' : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'} font-bold tt-rowspan-badge">${hInfo.badge}</span>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-[160px] leading-tight break-keep mx-auto tt-rowspan-desc">${hInfo.descTable}</p>
                  </div>
                </td>
              `;
            }
          } else if (d.dayType === 'fullday_event') {
            // 전일 학교 행사 (체육한마당, 수학여행 등): rowspan 8
            if (rowIndex === 0) {
              const cleanEventName = stripExtraAnnotations(d.fullDayEvent.EVENT_NM || '학교 행사');
              tableHtml += `
                <td rowspan="8" class="tt-rowspan-cell p-3 sm:p-4 bg-blue-50/70 dark:bg-blue-950/25 border-r border-b border-slate-200 dark:border-slate-700 text-center align-middle ${todayColClass}">
                  <div class="flex flex-col items-center justify-center py-8 space-y-2 tt-rowspan-inner">
                    <span class="text-3xl tt-rowspan-emoji">🏃‍♂️</span>
                    <span class="font-extrabold text-sm sm:text-base text-brand-700 dark:text-blue-300 tt-rowspan-title">${cleanEventName}</span>
                    <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-blue-300 font-bold tt-rowspan-badge">전일 학교 행사</span>
                    <p class="text-[11px] text-slate-400 mt-1 font-medium tt-rowspan-desc">전교생 행사 진행 (수업 대체)</p>
                  </div>
                </td>
              `;
            }
          } else if (d.dayType === 'mock_exam') {
            // 전국연합학력평가 / 수능: rowspan 8
            if (rowIndex === 0) {
              const cleanMockName = stripExtraAnnotations(d.mockExamEvent.EVENT_NM || '모의평가');
              const isSuneung = d.mockExamEvent && d.mockExamEvent.EVENT_NM.includes('수학능력시험');
              tableHtml += `
                <td rowspan="8" class="tt-rowspan-cell p-3 sm:p-4 bg-amber-50/60 dark:bg-amber-950/25 border-r border-b border-slate-200 dark:border-slate-700 text-center align-middle ${todayColClass}">
                  <div class="flex flex-col items-center justify-center py-8 space-y-2 tt-rowspan-inner">
                    <span class="text-3xl tt-rowspan-emoji">📝</span>
                    <span class="font-extrabold text-sm sm:text-base text-amber-800 dark:text-amber-200 tt-rowspan-title">${cleanMockName}</span>
                    <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold tt-rowspan-badge">${isSuneung ? '대학수학능력시험' : '전국연합학력평가'}</span>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium tt-rowspan-desc">${isSuneung ? '1~5교시 대학수학능력시험 본고사 일과' : '1~7교시 모의고사 평가 일과'}</p>
                  </div>
                </td>
              `;
            }
          } else if (d.dayType === 'paper_exam') {
            // 정기시험 (중간/기말고사): 
            // 1~4교시: 괄호 등 부가 부분 제외, 최대한 간단하게 표시 (rowspan 4)
            if (rowIndex === 0) {
              const cleanExamTitle = stripExtraAnnotations(d.paperExamEvent.EVENT_NM || '정기시험');
              tableHtml += `
                <td rowspan="4" class="tt-rowspan-cell p-3 bg-amber-50/70 dark:bg-amber-950/30 border-r border-b border-slate-200 dark:border-slate-700 text-center align-middle ${todayColClass}">
                  <div class="flex flex-col items-center justify-center py-4 space-y-1 tt-rowspan-inner">
                    <span class="text-2xl tt-rowspan-emoji">📝</span>
                    <span class="font-extrabold text-xs sm:text-sm text-amber-900 dark:text-amber-100 tt-rowspan-title">${cleanExamTitle}</span>
                  </div>
                </td>
              `;
            } else if (rowIndex === 4) {
              // 점심시간 행
              tableHtml += `
                <td class="tt-lunch-cell py-2 px-1 bg-slate-50/80 dark:bg-slate-800/60 text-[10px] text-slate-400 border-r border-b border-slate-200 dark:border-slate-700 ${todayColClass}">
                  🍱 점심<span class="tt-lunch-suffix">시간</span>
                </td>
              `;
            } else if (rowIndex >= 5) {
              // 5, 6, 7교시: "정기시험 5,6,7교시는 그냥 빈 공간으로 둬" -> 빈 공간 (빈 셀)
              tableHtml += `
                <td class="p-1.5 sm:p-2 border-r border-b border-slate-200 dark:border-slate-700 ${todayColClass}"></td>
              `;
            }
          } else {
            // regular: 일반 수업일
            if (slot.type === 'lunch') {
              tableHtml += `
                <td class="tt-lunch-cell py-2 px-1 bg-slate-50/80 dark:bg-slate-800/60 text-[10px] text-slate-400 border-r border-b border-slate-200 dark:border-slate-700 ${todayColClass}">
                  🍱 점심<span class="tt-lunch-suffix">시간</span>
                </td>
              `;
            } else {
              const p = slot.perio;
              const periodItem = d.periods.find(item => item.perio === p);
              const slotKey = `g${grade}_c${classNm}_d${d.dayIndex}_p${p}`;
              const meta = (state.customTimetableMeta && state.customTimetableMeta[slotKey]) || {};
              const hideTeacher = isTeacherDisabledSlot(periodItem.subject, d.dayIndex, p);
              const teacher = hideTeacher ? '' : (meta.teacher || '');
              const schedules = getSlotSchedulesForWeek(meta, fromYmd);
              const teacherDisplay = teacher ? (teacher.endsWith('T') || teacher.endsWith('t') ? teacher : `${teacher}T`) : '';

              tableHtml += `
                <td class="p-1.5 sm:p-2 border-r border-b border-slate-200 dark:border-slate-700 align-middle ${todayColClass}">
                  <div class="timetable-slot-card py-2 px-1 sm:px-2 rounded-xl transition cursor-pointer relative ${periodItem.isChangche ? 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800' : periodItem.isFree ? 'bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 border border-dashed border-slate-200 dark:border-slate-700' : 'bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'}"
                       data-slot-key="${slotKey}"
                       data-week-monday="${fromYmd}"
                       data-grade="${grade}"
                       data-class="${classNm}"
                       data-day-index="${d.dayIndex}"
                       data-day-name="${d.short}"
                       data-perio="${p}"
                       data-subject="${periodItem.subject}">
                    ${(() => {
                      const badges = getAllSlotBadgesDisplay(schedules);
                      if (!badges || badges.length === 0) return '';
                      return `
                        <div class="timetable-badge-group">
                          ${badges.map(b => `<span class="timetable-schedule-badge ${b.badgeClass || ''}" title="${b.title}">${b.text}</span>`).join('')}
                        </div>
                      `;
                    })()}
                    <div class="tt-slot-subject font-extrabold text-xs sm:text-sm truncate" title="${periodItem.subject}">
                      ${renderResponsiveSubjectHtml(periodItem.subject)}
                    </div>
                    ${teacherDisplay ? `<div class="tt-slot-teacher text-[10px] text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5">${teacherDisplay}</div>` : ''}
                    <div class="tt-slot-subtag flex items-center justify-center space-x-1 mt-0.5">
                      ${periodItem.isChangche ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold">창체</span>' : ''}
                      ${periodItem.isFree ? `<span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-400 font-medium">${periodItem.freeNote || '공강'}</span>` : ''}
                    </div>
                  </div>
                </td>
              `;
            }
          }
        });

        tableHtml += `</tr>`;
      });

      tableHtml += `
          </tbody>
        </table>
      `;

      weekContainer.innerHTML = tableHtml;
    }

    // 2) 홈 대시보드 시간표 프리뷰 최우선 렌더링 (항상 '이번 주 오늘' 기준 유지 - 주간 시간표 탭에서 다른 주를 탐색해도 홈 화면 오늘 시간표는 유지)
    const todayMondayYmd = formatDateYYYYMMDD(getMondayOfWeek(state.currentDate));
    const isRenderingCurrentWeek = (fromYmd === todayMondayYmd);

    if (homeTimetableList && isRenderingCurrentWeek) {
      const isWeekend = (state.currentDate.getDay() === 0 || state.currentDate.getDay() === 6);

      const specialPanel = (toneClass, emoji, title, desc, extra = '') => `
        <div class="flex-1 min-h-0 flex flex-col items-center justify-center text-center p-6 rounded-2xl border ${toneClass} space-y-3">
          <span class="text-6xl xl:text-7xl leading-none">${emoji}</span>
          <p class="text-xl xl:text-2xl font-black leading-snug">${title}</p>
          <p class="text-sm xl:text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed break-keep">${desc}</p>
          ${extra}
        </div>
      `;

      if (isWeekend) {
        state.homeTodayPeriods = [];
        homeTimetableList.innerHTML = specialPanel(
          'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200',
          '☕', '주말에는 정규 수업이 없습니다', '푹 쉬고 다음 주에 힘차게 만나요!',
          `<button class="nav-switch-btn text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center" data-target="timetable"><span>주간 전체 시간표 확인</span><i data-lucide="chevron-right" class="w-4 h-4 ml-0.5"></i></button>`
        );
      } else {
        const todayDayData = daysData.find(d => d.isToday);
        if (todayDayData) {
          if (todayDayData.dayType !== 'regular') state.homeTodayPeriods = [];

          if (todayDayData.dayType === 'holiday') {
            const hInfo = todayDayData.holidayInfo || getHolidayPresentation(todayDayData.holidayEvent);
            homeTimetableList.innerHTML = specialPanel(
              'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
              hInfo.emoji, `오늘은 ${hInfo.cleanName}`, hInfo.descHome,
              `<span class="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200">${hInfo.badge}</span>`
            );
          } else if (todayDayData.dayType === 'fullday_event') {
            homeTimetableList.innerHTML = specialPanel(
              'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-brand-700 dark:text-blue-300',
              '🏃‍♂️', `오늘은 ${stripExtraAnnotations(todayDayData.fullDayEvent.EVENT_NM)}`, '전일 학교 행사로 정규 수업을 대체합니다. 안전하고 즐거운 행사 되세요! ✨'
            );
          } else if (todayDayData.dayType === 'mock_exam') {
            const isSuneung = todayDayData.mockExamEvent && todayDayData.mockExamEvent.EVENT_NM.includes('수학능력시험');
            homeTimetableList.innerHTML = specialPanel(
              'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
              '📝', `오늘은 ${stripExtraAnnotations(todayDayData.mockExamEvent.EVENT_NM)}`,
              isSuneung ? '그동안 흘린 땀방울이 최고의 결실을 맺기를 진심으로 응원합니다! 🎓' : '시험에 최선을 다해 좋은 결과 있기를 응원합니다! 💯'
            );
          } else if (todayDayData.dayType === 'paper_exam') {
            const cleanTitle = stripExtraAnnotations(todayDayData.paperExamEvent.EVENT_NM || '정기시험');
            homeTimetableList.innerHTML = specialPanel(
              'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
              '📝', `오늘은 ${cleanTitle}`, '1~4교시 정기시험 진행 (5~7교시 수업 없음). 끝까지 집중해서 실력을 발휘하세요!'
            );
          } else {
            const currentPeriodInfo = getCurrentPeriodStatus();
            const periodRows = todayDayData.periods.map(item => {
              const slotKey = `g${grade}_c${classNm}_d${todayDayData.dayIndex}_p${item.perio}`;
              const meta = (state.customTimetableMeta && state.customTimetableMeta[slotKey]) || {};
              const hideTeacher = isTeacherDisabledSlot(item.subject, todayDayData.dayIndex, item.perio);
              const teacher = hideTeacher ? '' : (meta.teacher || '');
              const teacherDisplay = teacher ? (teacher.endsWith('T') || teacher.endsWith('t') ? teacher : `${teacher}T`) : '';
              return { item, slotKey, meta, teacherDisplay, schedules: getSlotSchedulesForWeek(meta, todayMondayYmd) };
            });

            // 실시간 교시 상황판용 당일 교시 데이터 캐싱
            state.homeTodayPeriods = periodRows.map(r => ({
              perio: r.item.perio,
              subject: r.item.subject,
              teacher: r.teacherDisplay,
              isFree: r.item.isFree
            }));

            homeTimetableList.innerHTML = periodRows.map(({ item, slotKey, teacherDisplay, schedules }) => {
              const isNowActive = (currentPeriodInfo.statusType === 'class' && currentPeriodInfo.currentPerio === item.perio);
              const cardTone = item.isFree
                ? 'border-dashed !bg-slate-50/50 dark:!bg-slate-800/40 text-slate-400'
                : item.isChangche
                  ? '!bg-teal-50/70 dark:!bg-teal-950/30 !border-teal-200 dark:!border-teal-800'
                  : 'hover:!bg-slate-100 dark:hover:!bg-slate-700/50';
              const numTone = isNowActive
                ? 'bg-brand-600 text-white shadow-sm'
                : item.isFree
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  : item.isChangche
                    ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                    : 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300';
              const subjectTone = isNowActive
                ? 'text-brand-700 dark:text-brand-300 font-black'
                : item.isFree
                  ? 'text-slate-400'
                  : item.isChangche
                    ? 'text-teal-700 dark:text-teal-300 font-extrabold'
                    : 'text-slate-900 dark:text-slate-100 font-extrabold';

              return `
                <div class="timetable-slot-card home-period-card cursor-pointer transition ${isNowActive ? 'period-now-active ring-2 ring-brand-600' : ''} ${cardTone}"
                     data-slot-key="${slotKey}"
                     data-week-monday="${todayMondayYmd}"
                     data-grade="${grade}"
                     data-class="${classNm}"
                     data-day-index="${todayDayData.dayIndex}"
                     data-day-name="${todayDayData.short}"
                     data-perio="${item.perio}"
                     data-subject="${item.subject}">
                  <div class="flex items-center gap-2.5 xl:gap-3 min-w-0 flex-1">
                    <span class="hp-num ${numTone}">${item.perio}</span>
                    <span class="hp-subject ${subjectTone}" title="${item.subject}">${item.subject}</span>
                  </div>
                  <div class="hp-right flex items-center gap-1.5 xl:gap-2 shrink-0">
                    ${isNowActive ? `
                      <span class="now-period-pill px-2 py-1 rounded-md text-xs font-extrabold bg-[#1365C8] text-white flex items-center space-x-1 shrink-0 shadow-xs">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 live-pulse-dot"></span>
                        <span>NOW</span>
                      </span>
                    ` : ''}
                    ${(() => {
                      const badges = getAllSlotBadgesDisplay(schedules);
                      if (!badges || badges.length === 0) return '';
                      return `
                        <div class="flex items-center gap-1.5 shrink-0">
                          ${badges.map(b => {
                            if (b.isEmoji) {
                              return `<span class="text-xl xl:text-2xl leading-none select-none shrink-0 drop-shadow-2xs" title="${b.title}">${b.text}</span>`;
                            }
                            return `<span class="min-w-[20px] h-[20px] px-1.5 text-white text-[10px] font-extrabold rounded-[4px] flex items-center justify-center shadow-xs shrink-0 whitespace-nowrap" style="background-color: ${b.bgHex || '#E11D48'};" title="${b.title}">${b.text}</span>`;
                          }).join('')}
                        </div>
                      `;
                    })()}
                    ${item.isFree ? `
                      <span class="hp-desktop-type-tag text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-400 font-semibold whitespace-nowrap">${item.freeNote || '공강'}</span>
                    ` : item.isChangche ? `
                      <span class="hp-desktop-type-tag text-xs px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold whitespace-nowrap">창체</span>
                    ` : ''}
                    ${teacherDisplay ? `<span class="hp-teacher ${isNowActive ? '!text-brand-600 dark:!text-brand-400 font-bold' : ''}">${teacherDisplay}</span>` : ''}
                  </div>
                </div>
              `;
            }).join('');

            // 상단 실시간 교시 상황판 즉시 동기화
            updateRealtimeBoard();
          }
        } else {
          homeTimetableList.innerHTML = '<p class="flex-1 flex items-center justify-center text-sm text-slate-400">오늘 시간표 데이터가 없습니다.</p>';
        }
      }
    }

    // 3) 스마트폰 전용: 요일별 상세 시간표 & 등록 일정(수행·준비물·숙제) 브리핑 패널 렌더링 (독립 예외 처리로 홈 시간표 영향 차단)
    try {
      renderMobileTimetableDayPanel(daysData, grade, classNm, fromYmd);
    } catch (mobileErr) {
      console.warn('Error rendering mobile timetable panel:', mobileErr);
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Error rendering timetable:', err);
  }
}

// 스마트폰 전용: 주간 시간표 하단 요일별 상세 & 등록된 일정(수행·준비물·숙제) 브리핑 카드 렌더링
function renderMobileTimetableDayPanel(daysData, grade, classNm, fromYmd) {
  const panel = document.getElementById('timetable-mobile-day-panel');
  if (!panel || !Array.isArray(daysData) || daysData.length === 0) return;

  if (state.isSmartphone) {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }

  // 기본 선택 요일: 오늘이 포함되면 오늘 요일, 아니면 월요일(0)
  if (state.mobileTimetableDayOffset === undefined || state.mobileTimetableDayOffset < 0 || state.mobileTimetableDayOffset > 4) {
    const todayMatch = daysData.find(d => d.isToday);
    state.mobileTimetableDayOffset = todayMatch ? todayMatch.offset : 0;
  }

  const activeDay = daysData.find(d => d.offset === state.mobileTimetableDayOffset) || daysData[0];

  // 요일별 등록된 일정 개수 파악
  const dayTaskCounts = daysData.map(d => {
    if (d.dayType !== 'regular') return 0;
    let cnt = 0;
    d.periods.forEach(pItem => {
      const sk = `g${grade}_c${classNm}_d${d.dayIndex}_p${pItem.perio}`;
      const meta = (state.customTimetableMeta && state.customTimetableMeta[sk]) || {};
      const scheds = getSlotSchedulesForWeek(meta, fromYmd);
      cnt += (scheds ? scheds.length : 0);
    });
    return cnt;
  });

  const dayTabsHtml = daysData.map((d, idx) => {
    const isSelected = (d.offset === activeDay.offset);
    const taskCount = dayTaskCounts[idx];
    return `
      <button type="button" data-select-mobile-day="${d.offset}"
        class="tt-mobile-day-btn flex-1 py-2 px-1 rounded-xl text-xs font-extrabold transition flex flex-col items-center justify-center gap-0.5 border relative ${
          isSelected
            ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
            : d.isToday
              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800'
              : 'bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 border-slate-200/70 dark:border-slate-700'
        }">
        <div class="flex items-center gap-1">
          <span>${d.short}요일</span>
          ${taskCount > 0 ? `<span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-rose-500'}"></span>` : ''}
        </div>
        <span class="text-[10px] font-medium ${isSelected ? 'text-brand-100' : 'text-slate-400'}">${d.date.getMonth() + 1}.${d.date.getDate()}${d.isToday ? ' · 오늘' : ''}</span>
      </button>
    `;
  }).join('');

  let bodyHtml = '';
  if (activeDay.dayType !== 'regular') {
    const labelMap = {
      holiday: activeDay.holidayInfo ? `${activeDay.holidayInfo.emoji} ${activeDay.holidayInfo.cleanName}` : '🎉 공휴일 / 휴업일',
      fullday_event: `🏃‍♂️ ${stripExtraAnnotations(activeDay.fullDayEvent?.EVENT_NM || '학교 행사')}`,
      mock_exam: `📝 ${stripExtraAnnotations(activeDay.mockExamEvent?.EVENT_NM || '전국연합학력평가')}`,
      paper_exam: `📝 ${stripExtraAnnotations(activeDay.paperExamEvent?.EVENT_NM || '정기시험')}`
    };
    bodyHtml = `
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/70 dark:border-slate-700 text-center space-y-1">
        <p class="text-sm font-extrabold text-slate-800 dark:text-slate-100">${labelMap[activeDay.dayType] || '특별 학사일정'}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">해당 요일은 정규 수업 대신 학사일정이 운영됩니다.</p>
      </div>
    `;
  } else {
    bodyHtml = `
      <div class="space-y-1.5">
        ${activeDay.periods.map(pItem => {
          const slotKey = `g${grade}_c${classNm}_d${activeDay.dayIndex}_p${pItem.perio}`;
          const meta = (state.customTimetableMeta && state.customTimetableMeta[slotKey]) || {};
          const hideTeacher = isTeacherDisabledSlot(pItem.subject, activeDay.dayIndex, pItem.perio);
          const teacher = hideTeacher ? '' : (meta.teacher || '');
          const teacherDisplay = teacher ? (teacher.endsWith('T') || teacher.endsWith('t') ? teacher : `${teacher}T`) : '';
          const schedules = getSlotSchedulesForWeek(meta, fromYmd);

          const tagColorMap = {
            '수행': 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
            '준비물': 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
            '숙제': 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
            '기타': 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
          };

          const schedulesDetailHtml = (schedules && schedules.length > 0)
            ? `<div class="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                ${schedules.map(s => {
                  const badgeObj = parseSingleScheduleBadge(s);
                  const pillTone = tagColorMap[s.tag] || tagColorMap['수행'];
                  const iconPrefix = badgeObj && badgeObj.isEmoji ? `${badgeObj.text} ` : `[${s.tag}] `;
                  return `<span class="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-lg border ${pillTone}">${iconPrefix}${s.text}</span>`;
                }).join('')}
              </div>`
            : '';

          return `
            <div class="timetable-slot-card p-2.5 rounded-xl border transition cursor-pointer ${
              pItem.isChangche
                ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/80'
                : pItem.isFree
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-dashed border-slate-200 dark:border-slate-700 text-slate-400'
                  : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100'
            }"
                 data-slot-key="${slotKey}"
                 data-week-monday="${fromYmd}"
                 data-grade="${grade}"
                 data-class="${classNm}"
                 data-day-index="${activeDay.dayIndex}"
                 data-day-name="${activeDay.short}"
                 data-perio="${pItem.perio}"
                 data-subject="${pItem.subject}">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    pItem.isChangche
                      ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                      : pItem.isFree
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        : 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300'
                  }">${pItem.perio}</span>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-sm font-extrabold ${pItem.isFree ? 'text-slate-400' : 'text-slate-900 dark:text-white'}">${pItem.subject}</span>
                      ${teacherDisplay ? `<span class="text-xs font-semibold text-slate-400">${teacherDisplay}</span>` : ''}
                      ${pItem.isChangche ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold">창체</span>' : ''}
                      ${pItem.isFree ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-400 font-medium">${pItem.freeNote || '공강'}</span>` : ''}
                    </div>
                    <div class="text-[11px] text-slate-400 font-mono">${pItem.time}</div>
                  </div>
                </div>
                <span class="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200/80 dark:border-slate-600 shrink-0">
                  ${schedules && schedules.length > 0 ? `일정 ${schedules.length}개` : '+ 일정/관리'}
                </span>
              </div>
              ${schedulesDetailHtml}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  panel.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <span class="text-sm">📌</span>
        <h3 class="text-sm font-extrabold text-slate-900 dark:text-white">${activeDay.name} 교시별 상세 · 과제 브리핑</h3>
      </div>
      <span class="text-[11px] text-slate-400">과목 터치 시 일정 추가</span>
    </div>
    <div class="flex items-center gap-1.5">
      ${dayTabsHtml}
    </div>
    ${bodyHtml}
  `;
}

// 11. 탭 전환 처리
function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.tab-content').forEach(el => {
    if (el.id === `tab-${tabId}`) {
      el.classList.remove('hidden');
      el.classList.add('animate-fadeIn');
    } else {
      el.classList.add('hidden');
    }
  });

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
      btn.classList.remove('anim-trigger');
      void btn.offsetWidth; // Force reflow to restart CSS animation
      btn.classList.add('anim-trigger');
      setTimeout(() => btn.classList.remove('anim-trigger'), 700);
    } else {
      btn.classList.remove('active', 'anim-trigger');
    }
  });

  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active', 'text-brand-600', 'dark:text-brand-400', 'font-bold');
      btn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-medium');
      btn.classList.remove('anim-trigger');
      void btn.offsetWidth; // Force reflow to restart CSS animation
      btn.classList.add('anim-trigger');
      setTimeout(() => btn.classList.remove('anim-trigger'), 700);
    } else {
      btn.classList.remove('active', 'text-brand-600', 'dark:text-brand-400', 'font-bold', 'anim-trigger');
      btn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-medium');
    }
  });

  if (tabId === 'home') {
    syncHomeDashboardToToday();
  } else if (tabId === 'meal') {
    renderMealsForDate(state.mealDate);
  } else if (tabId === 'schedule') {
    renderSchedule(state.scheduleYear, state.scheduleMonth);
  } else if (tabId === 'timetable') {
    const weekContainer = document.getElementById('timetable-week-container');
    const needsRender = !weekContainer || !weekContainer.children.length || weekContainer.querySelector('.animate-pulse') || state.timetableNeedsRefresh;
    if (needsRender) {
      renderTimetable(state.selectedGrade, state.selectedClass);
      state.timetableNeedsRefresh = false;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 12. 이벤트 리스너 등록
function initEventListeners() {
  document.querySelectorAll('.nav-tab-btn, .mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.addEventListener('click', (e) => {
    const switchBtn = e.target.closest('.nav-switch-btn');
    if (switchBtn && switchBtn.dataset.target) {
      switchTab(switchBtn.dataset.target);
    }
  });

  document.getElementById('btn-meal-prev')?.addEventListener('click', () => {
    state.mealDate.setDate(state.mealDate.getDate() - 1);
    renderMealsForDate(state.mealDate);
  });

  document.getElementById('btn-meal-next')?.addEventListener('click', () => {
    state.mealDate.setDate(state.mealDate.getDate() + 1);
    renderMealsForDate(state.mealDate);
  });

  document.getElementById('btn-meal-today')?.addEventListener('click', () => {
    state.mealDate = new Date(state.currentDate);
    renderMealsForDate(state.mealDate);
    showToast('오늘 날짜로 이동했습니다.');
  });

  document.getElementById('meal-date-input')?.addEventListener('change', (e) => {
    if (e.target.value) {
      const parts = e.target.value.split('-');
      state.mealDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      renderMealsForDate(state.mealDate);
    }
  });

  document.getElementById('btn-sched-prev-month')?.addEventListener('click', () => {
    state.scheduleMonth -= 1;
    if (state.scheduleMonth < 1) {
      state.scheduleMonth = 12;
      state.scheduleYear -= 1;
    }
    renderSchedule(state.scheduleYear, state.scheduleMonth);
  });

  document.getElementById('btn-sched-next-month')?.addEventListener('click', () => {
    state.scheduleMonth += 1;
    if (state.scheduleMonth > 12) {
      state.scheduleMonth = 1;
      state.scheduleYear += 1;
    }
    renderSchedule(state.scheduleYear, state.scheduleMonth);
  });

  document.querySelectorAll('.grade-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.grade-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.scheduleGradeFilter = chip.dataset.grade;
      renderSchedule(state.scheduleYear, state.scheduleMonth);
    });
  });

  document.getElementById('btn-timetable-prev-week')?.addEventListener('click', () => {
    if (!state.timetableMonday) state.timetableMonday = getMondayOfWeek(state.currentDate);
    state.timetableMonday.setDate(state.timetableMonday.getDate() - 7);
    renderTimetable(state.selectedGrade, state.selectedClass);
  });

  document.getElementById('btn-timetable-current-week')?.addEventListener('click', () => {
    state.timetableMonday = getMondayOfWeek(state.currentDate);
    renderTimetable(state.selectedGrade, state.selectedClass);
    showToast('이번 주 시간표로 이동했습니다.');
  });

  document.getElementById('btn-timetable-next-week')?.addEventListener('click', () => {
    if (!state.timetableMonday) state.timetableMonday = getMondayOfWeek(state.currentDate);
    state.timetableMonday.setDate(state.timetableMonday.getDate() + 7);
    renderTimetable(state.selectedGrade, state.selectedClass);
  });

  document.getElementById('btn-timetable-refresh')?.addEventListener('click', () => {
    if (!state.timetableMonday) state.timetableMonday = getMondayOfWeek(state.currentDate);
    const monday = state.timetableMonday;
    const friday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4);
    const fromYmd = formatDateYYYYMMDD(monday);
    const toYmd = formatDateYYYYMMDD(friday);
    const cacheKey = `kumho_real_tt_v7_${state.selectedGrade}_${state.selectedClass}_${fromYmd}_${toYmd}`;
    delete state.cache.timetables[cacheKey];
    try {
      localStorage.removeItem(cacheKey);
    } catch (e) {}
    renderTimetable(state.selectedGrade, state.selectedClass, true);
    showToast('나이스 공식 시간표를 새로고침했습니다.');
  });

  document.getElementById('btn-fullscreen')?.addEventListener('click', toggleKioskMode);
  document.getElementById('btn-kiosk-toggle')?.addEventListener('click', toggleKioskMode);

  document.addEventListener('fullscreenchange', () => {
    updateKioskUI(!!(document.fullscreenElement || document.webkitFullscreenElement));
  });
  document.addEventListener('webkitfullscreenchange', () => {
    updateKioskUI(!!(document.fullscreenElement || document.webkitFullscreenElement));
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    setDarkMode(!state.isDark);
  });

  document.getElementById('btn-allergens-modal')?.addEventListener('click', () => openModal('modal-allergen'));
  document.getElementById('btn-close-allergen-modal')?.addEventListener('click', () => closeModal('modal-allergen'));

  document.getElementById('btn-school-info')?.addEventListener('click', () => openModal('modal-school-info'));
  document.getElementById('btn-close-school-info')?.addEventListener('click', () => closeModal('modal-school-info'));

  // 시간표 슬롯 클릭 위임 (주간 시간표, 모바일 요일별 상세 패널, 홈 시간표) 및 모바일 요일 선택
  document.addEventListener('click', (e) => {
    const mobileDayBtn = e.target.closest('[data-select-mobile-day]');
    if (mobileDayBtn) {
      const nextOffset = parseInt(mobileDayBtn.dataset.selectMobileDay, 10);
      if (!isNaN(nextOffset) && state.lastRenderedDaysData) {
        state.mobileTimetableDayOffset = nextOffset;
        const monday = state.timetableMonday || getMondayOfWeek(state.currentDate);
        renderMobileTimetableDayPanel(state.lastRenderedDaysData, state.selectedGrade, state.selectedClass, formatDateYYYYMMDD(monday));
      }
      return;
    }

    if (state.isSmartphone) {
      const dayTh = e.target.closest('th[data-mobile-day-offset]');
      if (dayTh) {
        const nextOffset = parseInt(dayTh.dataset.mobileDayOffset, 10);
        if (!isNaN(nextOffset) && state.lastRenderedDaysData) {
          state.mobileTimetableDayOffset = nextOffset;
          const monday = state.timetableMonday || getMondayOfWeek(state.currentDate);
          renderMobileTimetableDayPanel(state.lastRenderedDaysData, state.selectedGrade, state.selectedClass, formatDateYYYYMMDD(monday));
        }
        return;
      }
    }

    let slotCard = e.target.closest('.timetable-slot-card');
    if (!slotCard) {
      const td = e.target.closest('td');
      if (td) {
        slotCard = td.querySelector('.timetable-slot-card');
      }
    }
    if (slotCard && slotCard.dataset.slotKey) {
      const { slotKey, grade, class: classNm, dayIndex, dayName, perio, subject, weekMonday } = slotCard.dataset;
      openTimetableSlotModal(slotKey, grade, classNm, dayIndex, dayName, perio, subject, weekMonday);
    }
  });

  // ESC 키로 모든 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['modal-settings', 'modal-allergen', 'modal-school-info', 'modal-dday-setting', 'modal-timetable-detail'].forEach(id => closeModal(id));
    }
  });

  // 시간표 상세/일정 관리 모달 이벤트
  document.getElementById('btn-close-timetable-modal')?.addEventListener('click', () => {
    closeModal('modal-timetable-detail');
  });

  document.getElementById('btn-save-slot-meta')?.addEventListener('click', saveCurrentSlotMeta);
  document.getElementById('btn-clear-slot-meta')?.addEventListener('click', clearCurrentSlotMeta);

  const btnAddSlotSchedule = document.getElementById('btn-add-slot-schedule');
  const inputSlotNewSchedule = document.getElementById('input-slot-new-schedule');
  btnAddSlotSchedule?.addEventListener('click', addSlotSchedule);
  inputSlotNewSchedule?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSlotSchedule();
    }
  });

  document.getElementById('slot-tag-selector')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.slot-tag-btn');
    if (btn && btn.dataset.tag) {
      setSlotActiveTag(btn.dataset.tag);
    }
  });

  document.getElementById('slot-schedule-list')?.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-delete-schedule');
    if (delBtn && delBtn.dataset.idx !== undefined) {
      const idx = parseInt(delBtn.dataset.idx, 10);
      if (currentActiveSlot && currentActiveSlot.schedules) {
        currentActiveSlot.schedules.splice(idx, 1);
        renderSlotSchedulesList();
      }
    }
  });

  document.querySelectorAll('#modal-settings, #modal-allergen, #modal-school-info, #modal-dday-setting, #modal-timetable-detail').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });
}

// 13. 앱 초기화 시작
document.addEventListener('DOMContentLoaded', async () => {
  loadPreferences();
  detectAndApplySmartphoneMode();
  window.addEventListener('resize', detectAndApplySmartphoneMode);
  window.addEventListener('orientationchange', detectAndApplySmartphoneMode);

  initSettingsModal();
  initAllergenModal();
  initDDayModal();
  initEventListeners();

  state.timetableMonday = getMondayOfWeek(state.currentDate);

  const headerDate = document.getElementById('header-date');
  if (headerDate) headerDate.textContent = formatDateKorean(state.currentDate);

  document.querySelectorAll('.grade-chip').forEach(chip => {
    if (chip.dataset.grade === state.scheduleGradeFilter) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  // 1단계: 0ms 즉시 렌더링 (학사일정, 주간/오늘 시간표 마스터 데이터 및 실시간 일과 상황판 0초 즉각 출력)
  renderSchedule(state.scheduleYear, state.scheduleMonth);
  await renderTimetable(state.selectedGrade, state.selectedClass);
  initRealtimeClock();

  if (window.lucide) {
    lucide.createIcons();
  }

  // 2단계: 홈 대시보드 오늘 기준 실시간 급식 동기화
  await syncHomeDashboardToToday();

  // 3단계: 전자칠판 절전 복귀 / 네트워크 재연결 / 지연 로딩 시 자동 복구 워치독
  window.addEventListener('online', () => {
    syncHomeDashboardToToday();
    renderHomeWeatherWidget(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const homeList = document.getElementById('home-timetable-list');
      const weekCont = document.getElementById('timetable-week-container');
      if ((homeList && homeList.querySelector('.animate-pulse')) || (weekCont && weekCont.querySelector('.animate-pulse'))) {
        renderTimetable(state.selectedGrade, state.selectedClass);
      }
      updateRealtimeBoard();
    }
  });

  setTimeout(() => {
    const homeList = document.getElementById('home-timetable-list');
    const weekCont = document.getElementById('timetable-week-container');
    if ((homeList && homeList.querySelector('.animate-pulse')) || (weekCont && weekCont.querySelector('.animate-pulse'))) {
      renderTimetable(state.selectedGrade, state.selectedClass);
    }
  }, 600);

  if (window.lucide) {
    lucide.createIcons();
  }
});
