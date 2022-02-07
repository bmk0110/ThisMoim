package com.websocket.board.repo;

import com.websocket.board.dto.Channel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChannelRepository extends CrudRepository<Channel, Long> {
    Channel findByChannelId(String channelId);
}
