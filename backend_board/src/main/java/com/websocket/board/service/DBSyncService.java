package com.websocket.board.service;

import com.websocket.board.model.SocketBoardMessage;

public interface DBSyncService {

    void postitDBSync(SocketBoardMessage board);
    void postitDeleteSync(SocketBoardMessage board);

    void channelDBIdCountSync(String channelId, Long idCount);

}
