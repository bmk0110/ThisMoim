package com.websocket.board.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.websocket.board.model.Board;
import com.websocket.board.model.SocketBoardMessage;
import com.websocket.board.service.InitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BoardInitController {

    @Autowired
    InitService initService;

    @CrossOrigin("*")
    @GetMapping("/board/{channelId}")
    public Board getBoardStatusInit(@PathVariable("channelId") String channelId)
            throws JsonProcessingException {
        return initService.getBoard(channelId);
    }

}
