package com.websocket.board.controller;

import com.websocket.board.config.JwtTokenProvider;
import com.websocket.board.dto.Channel;
import com.websocket.board.model.LoginInfo;
import com.websocket.board.repo.ChannelRedisRepository;
import com.websocket.board.service.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class ChannelController {

    private final ChannelRedisRepository channelRedisRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final ChannelService channelService;

    @GetMapping("/channels")
    @ResponseBody
    public List<Channel> channel() {
        List<Channel> channels = channelRedisRepository.findAllChannel();
        channels.stream().forEach(room -> room.setUserCount(channelRedisRepository.getUserCount(room.getChannelId())));
        return channels;
    }

    @PostMapping("/channel")
    @ResponseBody
    public Channel createChannel(@RequestParam("channelName") String channelName) {
        System.out.println(channelName);
        // save channel in mariadb
        Channel channel = channelService.saveChannel(channelName);
        // save channel in redis
        channelRedisRepository.createChannel(channel);
        return channel;
    }

    @GetMapping("/channel/{channelId}")
    @ResponseBody
    public Channel channelInfo(@PathVariable String channelId) {
        return channelRedisRepository.findChannelById(channelId);
    }

    @GetMapping("/user")
    @ResponseBody
    public LoginInfo getUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName();
        return LoginInfo.builder().name(name).token(jwtTokenProvider.generateToken(name)).build();
    }
}

