package com.eduscrum.awards.Disciplina;

import com.eduscrum.awards.model.Admin;
import com.eduscrum.awards.model.Curso;
import com.eduscrum.awards.model.Disciplina;
import com.eduscrum.awards.model.DisciplinaDTO;
import com.eduscrum.awards.model.PapelSistema;
import com.eduscrum.awards.repository.AdminRepository;
import com.eduscrum.awards.repository.CursoRepository;
import com.eduscrum.awards.repository.DisciplinaRepository;
import com.eduscrum.awards.service.DisciplinaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class DisciplinaControllerIT {

    @Autowired
    private DisciplinaService disciplinaService;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private AdminRepository adminRepository;

    @BeforeEach
    void limparBaseDados() {
        disciplinaRepository.deleteAll();
        cursoRepository.deleteAll();
        adminRepository.deleteAll();
    }
    // Helper para criar curso de teste
    private Curso criarCursoDeTeste(String codigo) {
        Admin admin = new Admin();
        admin.setNome("Admin Teste Disciplina");
        admin.setEmail("admindisc@test.com");
        admin.setPasswordHash("hash");
        admin.setPapelSistema(PapelSistema.ADMIN);
        admin = adminRepository.save(admin);

        Curso curso = new Curso();
        curso.setNome("Curso Teste Disciplina");
        curso.setCodigo(codigo);
        curso.setAdmin(admin);

        return cursoRepository.save(curso);
    }
    //segundo helper para criar um cruso com mail diferente
    private Curso criarCursoDeTeste2(String codigo) {
        Admin admin = new Admin();
        admin.setNome("Admin Teste Disciplina");
        admin.setEmail("admindic@test.com");
        admin.setPasswordHash("hash");
        admin.setPapelSistema(PapelSistema.ADMIN);
        admin = adminRepository.save(admin);

        Curso curso = new Curso();
        curso.setNome("Curso Teste Disciplina");
        curso.setCodigo(codigo);
        curso.setAdmin(admin);

        return cursoRepository.save(curso);
    }
    @Test
    @DisplayName("Deve criar disciplina com sucesso")
    void DeveCriarDisciplinaComSucesso() {
        Curso curso = criarCursoDeTeste("CURSO_DISC_TEST");

        DisciplinaDTO dto = new DisciplinaDTO();
        dto.setNome("Disciplina Teste");
        dto.setCodigo("DISC_TEST_1");

        Disciplina criada = disciplinaService.criarDisciplina(curso.getId(), dto);

        assertNotNull(criada.getId(), "ID da disciplina criada não deve ser nulo");
        assertEquals("Disciplina Teste", criada.getNome());
        assertEquals("DISC_TEST_1", criada.getCodigo());
        assertNotNull(criada.getCurso(), "Curso associado não deve ser nulo");
        assertEquals(curso.getId(), criada.getCurso().getId());

        // Verificar persistência no repositório
        Disciplina armazenada = disciplinaRepository.findById(criada.getId()).orElse(null);
        assertNotNull(armazenada, "Disciplina deve estar na base de dados");
        assertEquals("Disciplina Teste", armazenada.getNome());
    }

    @Test
    @DisplayName("Listar disciplinas por curso deve retornar disciplinas corretas")
    void listarDisciplinasPorCursoDeveRetornarDisciplinasCorretas() {
        Curso curso1 = criarCursoDeTeste("CURSO_DISC_1");
        Curso curso2 = criarCursoDeTeste2("CURSO_DISC_2");

        DisciplinaDTO dto1 = new DisciplinaDTO();
        dto1.setNome("Disciplina 1 Curso 1");
        dto1.setCodigo("DISC1_CURS1");
        disciplinaService.criarDisciplina(curso1.getId(), dto1);

        DisciplinaDTO dto2 = new DisciplinaDTO();
        dto2.setNome("Disciplina 2 Curso 1");
        dto2.setCodigo("DISC2_CURS1");
        disciplinaService.criarDisciplina(curso1.getId(), dto2);

        DisciplinaDTO dto3 = new DisciplinaDTO();
        dto3.setNome("Disciplina 1 Curso 2");
        dto3.setCodigo("DISC1_CURS2");
        disciplinaService.criarDisciplina(curso2.getId(), dto3);

        var disciplinasCurso1 = disciplinaService.listarPorCurso(curso1.getId());
        assertEquals(2, disciplinasCurso1.size(), "Curso 1 deve ter 2 disciplinas");

        var disciplinasCurso2 = disciplinaService.listarPorCurso(curso2.getId());
        assertEquals(1, disciplinasCurso2.size(), "Curso 2 deve ter 1 disciplina");
    }
    @Test
    @DisplayName("Deve atualizar uma disciplina com sucesso")
    void atualizarDisciplinacomSucesso(){
        Curso curso =criarCursoDeTeste("Curso_DISC_1");
        DisciplinaDTO dto = new DisciplinaDTO();
        dto.setNome("Primeira");
        dto.setCodigo("DISC_1");
        Disciplina criada= disciplinaService.criarDisciplina(curso.getId(), dto);
        
        DisciplinaDTO dtoAtualizada = new DisciplinaDTO();
        dtoAtualizada.setNome("Atualizada");
        dtoAtualizada.setCodigo("DISC_2");
        Disciplina atualizada= disciplinaService.atualizarDisciplina(criada.getId(), dtoAtualizada);

        assertEquals("Atualizada", atualizada.getNome());
        assertEquals("DISC_2", atualizada.getCodigo());


    }
    @Test 
    @DisplayName("Eliminar disciplina com sucesso")
    void eliminarDisciplinaComSucesso(){
        Curso curso= criarCursoDeTeste("Curso_DISC_1");
        DisciplinaDTO dto = new DisciplinaDTO();
        dto.setNome("Disciplina a eliminar");
        dto.setCodigo("l1");
        Disciplina crida= disciplinaService.criarDisciplina(curso.getId(), dto);

        disciplinaService.eliminarDisciplina(crida.getId());

        assertFalse(disciplinaRepository.existsById(curso.getId()));



    }
    @Test
    @DisplayName("Obter disciplina com sucesso")
    void obterDetalhesDaDisciplinaComSucesso(){
        Curso curso = criarCursoDeTeste("Curso_DISC_1");
        DisciplinaDTO dto = new DisciplinaDTO();
        dto.setNome("DIsciplina teste");
        dto.setCodigo("DT1");
        Disciplina criada= disciplinaService.criarDisciplina(curso.getId(), dto);

        var verificar= disciplinaService.obterDisciplina(criada.getId());
        assertEquals(criada.getId(), verificar.getId());
        assertEquals("DIsciplina teste", verificar.getNome());
        assertEquals("DT1", verificar.getCodigo());
        assertEquals(curso.getId(), verificar.getCursoId());

    }
}