package com.eduscrum.awards.service;

import com.eduscrum.awards.model.Curso;
import com.eduscrum.awards.repository.CursoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import com.eduscrum.awards.model.CursoDTO;
import com.eduscrum.awards.model.Admin;
import com.eduscrum.awards.repository.AdminRepository;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final AdminRepository adminRepository;

    public CursoService(CursoRepository cursoRepository, AdminRepository adminRepository) {
        this.cursoRepository = cursoRepository;
        this.adminRepository = adminRepository;
    }


    // Listar todos os cursos
    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }

    // Obter curso por ID
    public Curso obterCursoPorId(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com ID: " + id));
    }

    // Criar novo curso
   @Transactional
    public Curso criarCurso(CursoDTO dto) {
        // Verifica se o código já existe
        if (cursoRepository.existsByCodigo(dto.codigo)) {
            throw new RuntimeException("Já existe um curso com o código: " + dto.codigo);
        }

        // Verifica se o admin existe
        if (dto.adminId == null) {
            throw new RuntimeException("É necessário especificar um admin");
        }
        
        Admin admin = adminRepository.findById(dto.adminId)
                .orElseThrow(() -> new RuntimeException("Admin não encontrado com ID: " + dto.adminId));

        Curso curso = new Curso();
        curso.setNome(dto.nome);
        curso.setCodigo(dto.codigo);
        curso.setAdmin(admin);

        return cursoRepository.save(curso);
    }
    @Transactional
    public Curso atualizarCurso(Long id, CursoDTO dto) {
        Curso existente = obterCursoPorId(id);

        if (!existente.getCodigo().equals(dto.codigo)
                && cursoRepository.existsByCodigo(dto.codigo)) {
            throw new RuntimeException("Código de curso já utilizado");
        }

        existente.setNome(dto.nome);
        existente.setCodigo(dto.codigo);

        if (dto.adminId != null) {
            Admin admin = adminRepository.findById(dto.adminId)
                    .orElseThrow(() -> new RuntimeException("Admin não encontrado"));
            existente.setAdmin(admin);
        }

        return cursoRepository.save(existente);
    }


    // Eliminar curso
    @Transactional
    public void eliminarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("Curso não encontrado com ID: " + id);
        }
        cursoRepository.deleteById(id);
    }
}
