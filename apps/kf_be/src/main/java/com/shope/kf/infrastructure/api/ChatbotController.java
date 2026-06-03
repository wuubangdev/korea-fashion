package com.shope.kf.infrastructure.api;

import com.shope.kf.infrastructure.api.dto.request.ChatbotMessageRequest;
import com.shope.kf.infrastructure.api.dto.request.ChatbotSessionRequest;
import com.shope.kf.infrastructure.api.dto.response.ChatbotMessageResponse;
import com.shope.kf.infrastructure.api.dto.response.ChatbotSessionResponse;
import com.shope.kf.infrastructure.api.dto.response.ChatbotStoredMessageResponse;
import com.shope.kf.infrastructure.chatbot.ChatbotService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatbotSessionResponse>> sessions(
            Authentication authentication,
            @RequestParam(required = false) String clientSessionId
    ) {
        return ResponseEntity.ok(chatbotService.sessions(authentication, clientSessionId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<ChatbotSessionResponse> createSession(
            @Valid @RequestBody(required = false) ChatbotSessionRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(chatbotService.createSession(request, authentication, httpRequest));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatbotStoredMessageResponse>> messages(
            @PathVariable Long sessionId,
            Authentication authentication,
            @RequestParam(required = false) String clientSessionId
    ) {
        return ResponseEntity.ok(chatbotService.messages(sessionId, authentication, clientSessionId));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long sessionId,
            Authentication authentication,
            @RequestParam(required = false) String clientSessionId
    ) {
        chatbotService.deleteSession(sessionId, authentication, clientSessionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatbotMessageResponse> chat(
            @Valid @RequestBody ChatbotMessageRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(chatbotService.chat(request, authentication, httpRequest));
    }

    @PostMapping
    public ResponseEntity<ChatbotMessageResponse> legacyChat(
            @Valid @RequestBody ChatbotMessageRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(chatbotService.chat(request, authentication, httpRequest));
    }
}
