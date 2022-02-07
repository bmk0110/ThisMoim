package com.websocket.board.model;

import com.websocket.board.dto.Postit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocketBoardMessage implements Serializable {

//    public SocketBoardMessage(String channelId, List<Postit> postitList,long userCount,long idCount, DeletedModule delete) {
//        this.channelId = channelId;
//        this.userCount = userCount;
//        this.idCount = idCount;
//        this.postitList = postitList;
//        this.delete =
//        //this.channelName = channelName;
//        //this.numOfFixtures = 0;
//        //this.overMaxMembers = false;
//        //this.overMaxFixtures = false;
//        //this.liveChat = false;
//        //this.videoChat = false;
//    }

    // 채널 자체 정보
    private String channelId;
    private long userCount;
    //private String channelName;
    //private String sender;

    // 보드 전달 모듈 관련 인자
    private long idCount;
    private List<Postit> postitList; // 포스트잇 리스트
    private Boolean isDelete;
    private DeletedModule delete;
    // List<Calendar> calendarList; // 캘린더 리스트
    // List<Canvas> canvas; // 캔버스 리스트
    // List<Map> mapList; // 맵 리스트
    // List<Attendance> attendenceList; // 출석부 리스트
    // List<Attendance> voteList; // 출석부 리스트

    // 멤버, 부착물 관련 인자
    //private final int MAX_FIXTURES = 100; // 최대 부착물 갯수
    //private final int MAX_MEMBERS = 50; // 최대 멤버 수
    //private long userCount; // 멤버 수
    //private long numOfFixtures; //부착물 갯수
    //private boolean overMaxMembers; // 최대 멤버 수를 넘었는지
    //private boolean overMaxFixtures; // 최대 부착물 수를 넘었는지

    // 라이브채팅, 화상채팅
    //private boolean liveChat; // 라이브챗 켜져있는지
    //private boolean videoChat; // 화상채팅 켜져있는지

}
