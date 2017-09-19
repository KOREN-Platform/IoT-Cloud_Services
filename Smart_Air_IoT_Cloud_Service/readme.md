Smart Air IoT-Cloud Service
===========================

Smart Air IoT-Cloud 서비스는 여러 사이트에서 기상정보 및 미세먼지 정도를 측정하기 위한 다양한 형태의 데이터 수집 센서(온습도 센서, 먼지센서, 가스센서, 빛 센서 및 카메라 센서 등)들을 탑재한 고정형 또는 이동형 IoT기기(드론, 스마트폰)들을 운용하여 지속적으로 데이터를 수집하고 분석하는 서비스이다.

![Smart Air IoT-Cloud Service](https://github.com/KOREN-Platform/Services/blob/master/Images/4-1.png)

SmartX Open Platform에서 제공하는 Open SDN/SDI API를 활용하여 필요한 자원을 확보하고, 사용자가 서비스 운영에 필요한 요소기능들을 투입하고 이를 엮어내어 전체 서비스로 합성하는 지원을 받는 컨테이너기반의 Smart Air IoT-Cloud서비스 테스트베드를 구축하고 통합하여 실증한다. 각 사이트에서는 SmartX Open Platform에서 제공하는 클라우드/네트워크 슬라이스를 Type O SD-Access Box를 통해 접근한다. 즉, Smart Air IoT-Cloud 서비스에서 운용하는 드론 및 스마트폰과 같은 IoT기기들은 서비스 운용 과정의 하부 계층에 대한 고려 없이 Type O SD-Access Box와 연결함으로써 센싱 데이터를 DataLake에 전달한다. Type O Box는 각 사이트에서 WiFi를 이용해  IoT기기들과의 데이터 교환을 수행하고, 추가적인 WiFi AP를 메쉬로 구성하여 IoT기기의 데이터 수집 범위 확대 및 이동성을 지원할 수 있다. DataLake에 수집된 데이터는 서비스운용 시각화 및 IoT 데이터분석 UI도구를 활용하여 Smart Air IoT-Cloud Control Room에서 효과적으로 분석된다. 필요에 따라, 실시간성이 요구되는 센싱 데이터의 경우, DataLake로 수집될 뿐만 아니라 컨트롤 룸에 직접 전달되어 시각화되기도 한다.


Software Solutions
----------------------------
| No. | Software | Developer | Github Repository |
|:---:|:---:|:---:|:-----------|
| -   | - | - |https://github.com/KOREN-Platform/Services/tree/master/Smart_Air_IoT_Cloud_Service |


