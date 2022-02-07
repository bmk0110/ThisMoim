package com.websocket.board.service;

import com.websocket.board.dto.Channel;
import com.websocket.board.dto.Postit;
import com.websocket.board.model.SocketBoardMessage;
import com.websocket.board.repo.ChannelRedisRepository;
import com.websocket.board.repo.ChannelRepository;
import com.websocket.board.repo.PostitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DBSyncServiceImpl implements DBSyncService {

    private final PostitRepository postitRepository;
    private final ChannelRepository channelRepository;

    @Override
    public void postitDBSync(SocketBoardMessage board) {
//        Channel channel = channelRepository.findByChannelId(board.getChannelId());
//        channel.setPostitList(board.getPostitList());
//        channelRepository.save(channel);
        Postit postit = new Postit();
        for (int i = 0; i < board.getPostitList().size(); i++) {
            postit = board.getPostitList().get(i);
            Optional<Postit> requestDbResult = postitRepository.findByFrontPostitId(postit.getFrontPostitId());
            if(requestDbResult.isPresent()) {
                postit.setId(requestDbResult.get().getId());
            }
            //?
            postit.setChannel(channelRepository.findByChannelId(board.getChannelId()));
            postitRepository.save(postit);
        }
    }

    @Override
    @Transactional
    public void postitDeleteSync(SocketBoardMessage board) {
        long id = postitRepository.findPostitByChannel_ChannelIdAndFrontPostitId(board.getChannelId(), board.getDelete().getId()).getId();
        System.out.println(id);
        postitRepository.deleteById(id);
    }

    @Override
    public void channelDBIdCountSync(String channelId, Long idCount) {

        Channel channel = channelRepository.findByChannelId(channelId);
        channel.setIdCount(idCount);

        channelRepository.save(channel);
    }

}
