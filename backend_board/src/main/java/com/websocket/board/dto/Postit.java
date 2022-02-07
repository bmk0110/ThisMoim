package com.websocket.board.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Postit implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "postit_id")
    private Long id;

    private String title;
    private String contents;
    @Column(name = "\"left\"")
    private String left;
    @Column(name = "top")
    private String top;
    @Column(name = "front_postit_id")
    private Long frontPostitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id")
    @JsonBackReference
    private Channel channel;
}
