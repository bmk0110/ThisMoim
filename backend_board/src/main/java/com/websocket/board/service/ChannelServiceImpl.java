package com.websocket.board.service;

import com.websocket.board.dto.Channel;
import com.websocket.board.repo.ChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ChannelServiceImpl implements ChannelService {

    private final ChannelRepository channelRepository;

    @Override
    public Channel saveChannel(String channelName) {
        Channel channel = new Channel();
        channel.setChannelName(channelName);
        return channelRepository.save(channel);
    }
}
