--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: execution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.execution (
    id integer NOT NULL,
    git_commit character varying,
    git_commit_datetime timestamp without time zone,
    git_refs text,
    app_version character varying
);


ALTER TABLE public.execution OWNER TO postgres;

--
-- Name: execution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.execution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.execution_id_seq OWNER TO postgres;

--
-- Name: execution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.execution_id_seq OWNED BY public.execution.id;


--
-- Name: report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report (
    id integer NOT NULL,
    name character varying,
    capabilities character varying,
    file character varying,
    spec_id character varying,
    start_time timestamp without time zone,
    duration double precision,
    execution integer NOT NULL
);


ALTER TABLE public.report OWNER TO postgres;

--
-- Name: report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.report_id_seq OWNER TO postgres;

--
-- Name: report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;


--
-- Name: test_case_run; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_case_run (
    id integer NOT NULL,
    class_name character varying NOT NULL,
    name character varying NOT NULL,
    duration double precision NOT NULL,
    system_out text NOT NULL,
    system_err text NOT NULL,
    status character varying NOT NULL,
    message text,
    report integer NOT NULL
);


ALTER TABLE public.test_case_run OWNER TO postgres;

--
-- Name: test_case_run_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_case_run_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_case_run_id_seq OWNER TO postgres;

--
-- Name: test_case_run_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_case_run_id_seq OWNED BY public.test_case_run.id;


--
-- Name: execution id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.execution ALTER COLUMN id SET DEFAULT nextval('public.execution_id_seq'::regclass);


--
-- Name: report id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);


--
-- Name: test_case_run id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_case_run ALTER COLUMN id SET DEFAULT nextval('public.test_case_run_id_seq'::regclass);


--
-- Name: execution execution_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.execution
    ADD CONSTRAINT execution_pk PRIMARY KEY (id);


--
-- Name: report report_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pk PRIMARY KEY (id);


--
-- Name: test_case_run test_case_run_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_case_run
    ADD CONSTRAINT test_case_run_pk PRIMARY KEY (id);


--
-- Name: execution_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX execution_id_uindex ON public.execution USING btree (id);


--
-- Name: report_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX report_id_uindex ON public.report USING btree (id);


--
-- Name: test_case_run_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX test_case_run_id_uindex ON public.test_case_run USING btree (id);


--
-- Name: report execution___fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT execution___fk FOREIGN KEY (execution) REFERENCES public.execution(id);


--
-- Name: test_case_run report___fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_case_run
    ADD CONSTRAINT report___fk FOREIGN KEY (report) REFERENCES public.report(id);


--
-- PostgreSQL database dump complete
--

