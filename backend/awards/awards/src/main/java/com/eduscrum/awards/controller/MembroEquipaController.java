package com.eduscrum.awards.controller;

import com.eduscrum.awards.model.Equipa;
import com.eduscrum.awards.model.MembroEquipa;
import com.eduscrum.awards.model.Utilizador;
import com.eduscrum.awards.repository.EquipaRepository;
import com.eduscrum.awards.repository.MembroEquipaRepository;
import com.eduscrum.awards.repository.UtilizadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/membros")
@RequiredArgsConstructor
public class MembroEquipaController {

    private final MembroEquipaRepository membroRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final EquipaRepository equipaRepository;

    // DTO interno simples (sem mapper)
    public static class MembroRequest {
        public Long utilizadorId;
        public Long equipaId;
        public MembroEquipa.PapelScrum papelScrum;
    }

    // 🔵 CRIAR MEMBRO
    @PostMapping
public ResponseEntity<?> criar(@RequestBody MembroRequest req) {

    Equipa equipa = equipaRepository.findById(req.equipaId).orElse(null);
    if (equipa == null)
        return ResponseEntity.badRequest().body("Equipa não encontrada");

    Utilizador utilizador = utilizadorRepository.findById(req.utilizadorId).orElse(null);
    if (utilizador == null)
        return ResponseEntity.badRequest().body("Utilizador não encontrado");

    if (membroRepository.existsByEquipaIdAndUtilizadorId(req.equipaId, req.utilizadorId))
        return ResponseEntity.status(409).body("Utilizador já pertence à equipa");

    MembroEquipa membro = new MembroEquipa();
    membro.setEquipa(equipa);
    membro.setUtilizador(utilizador);
    membro.setPapelScrum(req.papelScrum);
    membro.setDataEntrada(LocalDateTime.now());

    return ResponseEntity.ok(membroRepository.save(membro));
}


    // 🔵 LISTAR MEMBROS DE UMA EQUIPA
    @GetMapping("/equipa/{equipaId}")
    public List<MembroEquipa> listarPorEquipa(@PathVariable Long equipaId) {
        return membroRepository.findByEquipaId(equipaId);
    }

    // 🔵 REMOVER MEMBRO
    @DeleteMapping("/{equipaId}/{utilizadorId}")
    public ResponseEntity<?> remover(
            @PathVariable Long equipaId,
            @PathVariable Long utilizadorId
    ) {
        var membro = membroRepository
                .findByEquipaIdAndUtilizadorId(equipaId, utilizadorId)
                .orElse(null);

        if (membro == null)
            return ResponseEntity.status(404).body("Membro não encontrado");

        membroRepository.delete(membro);
        return ResponseEntity.ok("Membro removido");
    }
}
