import mssql from 'mssql'
import PDFDocument from 'pdfkit-table';
import fs from 'fs'
import path from 'path';

// Define a interface para o objeto de retorno da função
interface DocumentResult {
    success: boolean;
    path: string;
}

async function gerarDados(titulo: string, modelo: string, sqlPool: any, dataInicial?: string, dataFinal?: string, empId?: number, estabelecimentoId?: number, localizacaoId?: number){
    try {
        let data;
        if (modelo === "modelo1") {
            let request = sqlPool.request();
            let stringFilters = "";

            if (dataInicial) {
                // CORREÇÃO: Usar o tipo VarChar para a data com o formato universal 'YYYY-MM-DD'
                stringFilters += ` AND COR_DUP_DATA_VENCIMENTO >= CONVERT(DATETIME, @dataInicial, 120)`;
                request.input('dataInicial', mssql.VarChar(10), dataInicial);
            }
            if (dataFinal) {
                // CORREÇÃO: Usar o tipo VarChar para a data com o formato universal 'YYYY-MM-DD'
                stringFilters += ` AND COR_DUP_DATA_VENCIMENTO <= CONVERT(DATETIME, @dataFinal, 120)`;
                request.input('dataFinal', mssql.VarChar(10), dataFinal);
            }
            if (empId) {
                stringFilters += ` AND e.GER_EMP_ID = @empId`;
                request.input('empId', mssql.Int, empId);
            }
            if (estabelecimentoId) {
                stringFilters += ` AND COR_DUP_ESTABELECIMENTO = @estabelecimentoId`;
                request.input('estabelecimentoId', mssql.Int, estabelecimentoId);
            }
            if (localizacaoId) {
                stringFilters += ` AND COR_DUP_LOCALIZACAO = @localizacaoId`;
                request.input('localizacaoId', mssql.Int, localizacaoId);
            }

            console.log("String filters: ", stringFilters)

            let result = await request.query(`
                SELECT [COR_DUP_DATA_EMISSAO] AS dataEmissao
                        ,[COR_DUP_VALOR_DUPLICATA] AS valorDuplicata
                        ,[COR_DUP_TIPO_FATURA] AS tipoFatura
                        ,[COR_DUP_DATA_VENCIMENTO] AS dataVencimento
                        ,[COR_DUP_DATA_PRORROGACAO] AS dataProrrogacao
                        ,[COR_DUP_DATA_CADASTRO] AS dataCadastro
                        ,[COR_DUP_LOCALIZACAO] AS idLocalizacao
                        ,l.COP_LOC_DESCRICAO AS localizacao
                        ,[COR_DUP_ESTABELECIMENTO] AS idEstabelecimento
                        ,est.COP_EST_DESCRICAO AS estabelecimento
                        ,[COR_DUP_DATA_BAIXA] AS dataBaixa
                        ,[COR_DUP_VALOR_BAIXA] AS valorBaixa
                        ,e.GER_EMP_NOME_FANTASIA AS nomeFantasia
                FROM COR_CADASTRO_DE_DUPLICATAS with(nolock) 
                INNER JOIN GER_EMPRESA e WITH (NOLOCK) ON e.GER_EMP_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_IDEMPRESA 
                INNER JOIN COP_LOCALIZACAO_CORE_E_COPA l WITH (NOLOCK) ON l.COP_LOC_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_LOCALIZACAO
                INNER JOIN COP_ESTABELECIMENTO est WITH (NOLOCK) ON est.COP_EST_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_ESTABELECIMENTO
                WHERE 1=1 ${stringFilters}
            `);

            console.log("Data: ", result.recordset);
            data = result.recordset;
        }

        if (!data || data.length === 0) {
            throw new Error("Dados não encontrados.");
        }
        return data
    } catch (error) {
        console.error("Error: ", error);
        throw error;
    }
}

async function gerarDocumento(dir: string, titulo: string, modelo: string, sqlPool: any, dataInicial?: string, dataFinal?: string, empId?: number, estabelecimentoId?: number, localizacaoId?: number): Promise<DocumentResult> {
    try {
        const dados = await gerarDados(titulo, modelo, sqlPool, dataInicial, dataFinal, empId, estabelecimentoId, localizacaoId);
        
        // Cria o PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margins: { top: 20, bottom: 20, left: 20, right: 20 }
        });
        
        // Nome do arquivo
        const nomeArquivo = `${titulo}.pdf`;
        const filePath = path.join(dir, nomeArquivo);

        // Retorna uma Promise que resolve quando o arquivo estiver totalmente salvo
        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            doc.fontSize(20).text('Relatório de Duplicatas', { align: 'center' });
            doc.moveDown();
            
            // Mapeia os dados para inserir na tabela
            const tableData = dados.map((item: { nomeFantasia: any; dataEmissao: string | number | Date; valorDuplicata: number; tipoFatura: any; dataVencimento: string | number | Date; localizacao: any; estabelecimento: any; dataBaixa: string | number | Date; valorBaixa: number; }) => ({
                nomeFantasia: item.nomeFantasia,
                dataEmissao: new Date(item.dataEmissao).toLocaleDateString(),
                valorDuplicata: `R$ ${item.valorDuplicata.toFixed(2)}`,
                tipoFatura: item.tipoFatura,
                dataVencimento: item.dataVencimento ? new Date(item.dataVencimento).toLocaleDateString() : 'N/A',
                localizacao: item.localizacao,
                estabelecimento: item.estabelecimento,
                dataBaixa: item.dataBaixa ? new Date(item.dataBaixa).toLocaleDateString() : 'N/A',
                valorBaixa: item.valorBaixa ? `R$ ${item.valorBaixa.toFixed(2)}` : 'N/A',
            }));

            // Define a estrutura da tabela
            const table = {
                headers: [
                    { label: "Empresa", property: 'nomeFantasia', width: 90 },
                    { label: "Emissão", property: 'dataEmissao', width: 60, align: 'center' },
                    { label: "Valor", property: 'valorDuplicata', width: 60, align: 'right' },
                    { label: "Tipo", property: 'tipoFatura', width: 40, align: 'center' },
                    { label: "Vencimento", property: 'dataVencimento', width: 60, align: 'center' },
                    { label: "Localização", property: 'localizacao', width: 90 },
                    { label: "Estabelecimento", property: 'estabelecimento', width: 90 },
                    { label: "Dt. Baixa", property: 'dataBaixa', width: 60, align: 'center' },
                    { label: "Vlr. Baixa", property: 'valorBaixa', width: 60, align: 'right' },
                ],
                datas: tableData,
            };

            // Gera a tabela
            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
                prepareRow: (row, i) => doc.font("Helvetica").fontSize(8)
            }).then(() => {
                doc.end();
            }).catch(reject);

            stream.on('finish', () => {
                console.log(`Relatório salvo como ${nomeArquivo}`);
                resolve({ success: true, path: filePath });
            });

            stream.on('error', (err) => {
                console.error("Erro ao gerar o documento:", err);
                reject(err);
            });
        });

    } catch (error) {
        console.error("Erro ao gerar o documento:", error);
        throw error;
    }
}

export default gerarDocumento;